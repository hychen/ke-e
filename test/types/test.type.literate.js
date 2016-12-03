describe('Arbitrary Literate', () => {

  it('word', () => {
    const a = ke.literate.word.generate();
    expect(a).to.not.eq(undefined);
  });

  it('words', () => {
    const a = ke.literate.words.generate();
    expect(a).to.not.eq(undefined);
  });

  it('sentence', () => {
    const a = ke.literate.sentence.generate();
    expect(a).to.not.eq(undefined);
  });

  it('sentences', () => {
    const a = ke.literate.sentences.generate();
    expect(a).to.not.eq(undefined);
  });

  it('paragraph', () => {
    const a = ke.literate.paragraph.generate();
    expect(a).to.not.eq(undefined);
  });

  it('paragraphs', () => {
    const a = ke.literate.paragraphs.generate();
    expect(a).to.not.eq(undefined);
  });

  it('lines', () => {
    const a = ke.literate.lines.generate();
    expect(a).to.not.eq(undefined);
  });

  it('text', () => {
    const a = ke.literate.text.generate();
    expect(a).to.not.eq(undefined);
  });

});
