const { expect } = require("chai");

describe("UserDetails contract", function () {
  it("Verifica registrazione utente", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("UserDetails");

    const hardhatToken = await Token.deploy();

    const ownerBalance = await hardhatToken.addUtente(owner.address,"secondo","terzo","quarto");
    expect(await hardhatToken.getUtente(owner.address)).to.deep.equal(["quarto"]);
  });
});