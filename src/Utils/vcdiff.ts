/**
 * Copyright 2010 Konstantin Plotnikov.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export class RollingHash {
    private primeBase: number = 257;
    private primeMod: number = 1000000007;
    private lastPower: number = 0;
    private lastString: string = '';
    private lastHash: number = 0;

    private moduloExp(base: number, power: number, modulo: number): number {
        let toReturn = 1;
        for (let i = 0; i < power; i += 1) {
            toReturn = (base * toReturn) % modulo;
        }
        return toReturn;
    }

    hash(toHash: string): number {
        let hash = 0;
        const toHashArray = toHash.split('');
        const len = toHashArray.length;
        for (let i = 0; i < len; i += 1) {
            hash += (toHashArray[i].charCodeAt(0) * this.moduloExp(this.primeBase, len - 1 - i, this.primeMod)) % this.primeMod;
            hash %= this.primeMod;
        }
        this.lastPower = this.moduloExp(this.primeBase, len - 1, this.primeMod);
        this.lastString = toHash;
        this.lastHash = hash;
        return hash;
    }

    nextHash(toAdd: string): number {
        let hash = this.lastHash;
        const lsArray = this.lastString.split('');
        hash -= (lsArray[0].charCodeAt(0) * this.lastPower);
        hash = hash * this.primeBase + toAdd.charCodeAt(0);
        hash %= this.primeMod;
        if (hash < 0) {
            hash += this.primeMod;
        }
        lsArray.shift();
        lsArray.push(toAdd);
        this.lastString = lsArray.join('');
        this.lastHash = hash;
        return hash;
    }
}

export class Block {
    private text: string;
    private offset: number;
    private nextBlock: Block | null = null;

    constructor(text: string, offset: number) {
        this.text = text;
        this.offset = offset;
    }

    getText(): string {
        return this.text;
    }

    getOffset(): number {
        return this.offset;
    }

    setNextBlock(nextBlock: Block): void {
        this.nextBlock = nextBlock;
    }

    getNextBlock(): Block | null {
        return this.nextBlock;
    }
}

export class BlockText {
    private originalText: string;
    private blockSize: number;
    private blocks: Block[] = [];

    constructor(originalText: string, blockSize: number) {
        this.originalText = originalText;
        this.blockSize = blockSize;
        const len = originalText.split('').length;
        for (let i = 0; i < len; i += blockSize) {
            const endIndex = i + blockSize >= len ? len : i + blockSize;
            this.blocks.push(new Block(originalText.substring(i, endIndex), i));
        }
    }

    getBlocks(): Block[] {
        return this.blocks;
    }

    getOriginalText(): string {
        return this.originalText;
    }

    getBlockSize(): number {
        return this.blockSize;
    }
}

export class Dictionary {
    private dictionary: { [key: number]: Block[] } = {};
    private dictionaryText: BlockText | null = null;

    put(key: number, block: Block): void {
        if (!this.dictionary.hasOwnProperty(key)) {
            this.dictionary[key] = [];
        }
        this.dictionary[key].push(block);
    }

    populateDictionary(dictText: BlockText, hasher: RollingHash): void {
        this.dictionary = {};
        this.dictionaryText = dictText;
        const blocks = dictText.getBlocks();
        for (let i = 0, len = blocks.length; i < len; i += 1) {
            this.put(hasher.hash(blocks[i].getText()), blocks[i]);
        }
    }

    getMatch(hash: number, blockSize: number, target: string): Block | null {
        if (this.dictionary.hasOwnProperty(hash)) {
            const blocks = this.dictionary[hash];
            for (let i = 0, len = blocks.length; i < len; i += 1) {
                if (blocks[i].getText() === target.substring(0, blockSize)) {
                    if (this.dictionaryText !== null && blocks[i].getNextBlock() === null) {
                        const dictText = this.dictionaryText.getOriginalText().substring(blocks[i].getOffset() + blockSize);
                        const targetText = target.substring(blockSize);
                        if (dictText.length === 0 || targetText.length === 0) {
                            return blocks[i];
                        }
                        let currentPointer = 0;
                        while (currentPointer < dictText.length && currentPointer < targetText.length &&
                            dictText[currentPointer] === targetText[currentPointer]) {
                            currentPointer += 1;
                        }
                        return new Block(blocks[i].getText() + dictText.substring(0, currentPointer), blocks[i].getOffset());
                    } else if (blocks[i].getNextBlock() !== null) {
                        return blocks[i];
                    } else {
                        return blocks[i];
                    }
                }
            }
            return null;
        }
        return null;
    }
}

export class Vcdiff {
    private dictText: Dictionary = new Dictionary();
    private blockSize: number = 20;
    private hash: RollingHash = new RollingHash();

    encode(dict: string, target: string): Array<string | number> {
        if (dict === target) {
            return [];
        }
        const diffString: Array<string | number> = [];
        const targetLength = target.length;
        let targetIndex = 0;
        let currentHash = -1;
        let addBuffer = '';
        this.dictText.populateDictionary(new BlockText(dict, this.blockSize), this.hash);
        while (targetIndex < targetLength) {
            if (targetLength - targetIndex < this.blockSize) {
                diffString.push(addBuffer + target.substring(targetIndex, targetLength));
                break;
            } else {
                if (currentHash === -1) {
                    currentHash = this.hash.hash(target.substring(targetIndex, targetIndex + this.blockSize));
                } else {
                    currentHash = this.hash.nextHash(target[targetIndex + (this.blockSize - 1)]);
                    if (currentHash < 0) {
                        currentHash = this.hash.hash(target.substring(0, targetIndex + this.blockSize));
                    }
                }
                const match = this.dictText.getMatch(currentHash, this.blockSize, target.substring(targetIndex));
                if (match === null) {
                    addBuffer += target[targetIndex];
                    targetIndex += 1;
                } else {
                    if (addBuffer.length > 0) {
                        diffString.push(addBuffer);
                        addBuffer = '';
                    }
                    diffString.push(match.getOffset());
                    diffString.push(match.getText().length);
                    targetIndex += match.getText().length;
                    currentHash = -1;
                }
            }
        }
        return diffString;
    }

    decode(dict: string, diff: Array<string | number>): string {
        const output: string[] = [];
        if (diff.length === 0) {
            return dict;
        }
        for (let i = 0; i < diff.length; i += 1) {
            if (typeof diff[i] === 'number') {
                output.push(dict.substring(diff[i] as number, (diff[i] as number) + (diff[i + 1] as number)));
                i += 1;
            } else if (typeof diff[i] === 'string') {
                output.push(diff[i] as string);
            }
        }
        return output.join('');
    }
}