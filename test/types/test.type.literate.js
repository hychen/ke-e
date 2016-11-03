describe('Arbitrary Literate', () => {

  it('word', () => {
    let a = ke.literate.word.generate();
    expect(a).to.not.eq(undefined);
  });

  it('words', () => {
    let a = ke.literate.words.generate();
    expect(a).to.not.eq(undefined);
  });

  it('sentence', () => {
    let a = ke.literate.sentence.generate();
    expect(a).to.not.eq(undefined);
  });

  it('sentences', () => {
    let a = ke.literate.sentences.generate();
    expect(a).to.not.eq(undefined);
  });

  it('paragraph', () => {
    let a = ke.literate.paragraph.generate();
    expect(a).to.not.eq(undefined);
  });

  it('paragraphs', () => {
    let a = ke.literate.paragraphs.generate();
    expect(a).to.not.eq(undefined);
  });

  it('lines', () => {
    let a = ke.literate.lines.generate();
    expect(a).to.not.eq(undefined);
  });

  it('text', () => {
    let a = ke.literate.text.generate();
    expect(a).to.not.eq(undefined);
  });

});
