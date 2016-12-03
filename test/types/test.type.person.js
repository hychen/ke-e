describe('Person', () => {

  it('localizable.', () => {
    const enFirstName = ke.person.firstName;
    const zhTwFirstName = ke.person.firstName.locale('zh-Hant-TW');
    expect(enFirstName.generate() !== zhTwFirstName.generate()).eq(true);
  });

});
