import { Vcdiff } from "./vcdiff";

test('works', () => {
    const vcdiffEncoder = new Vcdiff();
    const dict = "this is a long block of text that should hopefully be the test original text";
    const target = "this is a long block of text that should hopefully be the modified text";
    const diff = vcdiffEncoder.encode(dict, target);
    expect(diff).toStrictEqual([ 0, 58, 'modified text' ]);
    
    const decodedText = vcdiffEncoder.decode(dict, diff);
    expect(decodedText).toBe(target);
});
