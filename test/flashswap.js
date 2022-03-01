const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FlashSwap", function () {
  let flashswap;
  let owner; 
  let token0 = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
  let router1 = '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F' // sushiswap router
  let token2 = '0xdac17f958d2ee523a2206206994597c13d831ec7'
  let router2 = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' // uniswap v2 router
  let token4 = '0x4206931337dc273a630d328da6441786bfad668f'

  let vitalik = '0x6555e1cc97d3cba6eaddebbcd7ca51d75771e0b8'
  beforeEach(async() => {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [vitalik],
    });
    owner = await ethers.getSigner(vitalik)

    const FlashSwap = await ethers.getContractFactory("FlashSwap");
    flashswap = await FlashSwap.connect(owner).deploy();
    await flashswap.deployed();
    let iface = [
      `function approve(address user, uint256 amount) external view returns(bool)`,
      `function balanceOf(address user) external view returns(uint256 balance)`

    ]
    let token0Contract =  new ethers.Contract(token0, iface)
    await token0Contract.connect(owner).approve(flashswap.address, ethers.utils.parseEther('10'))

  })

  it('Should deploy flashswap', async() => {
    expect(flashswap.address).to.exist
  })
  it('Should have token0 balance', async() => {
    let iface = [
      `function balanceOf(address user) external view returns(uint256 balance)`,
      
    ]
    await flashswap.transferToMe(owner.address, token0, ethers.utils.parseEther('10') )

    let token0Contract =  new ethers.Contract(token0, iface, owner)

    let balance = await token0Contract.balanceOf(flashswap.address)
    console.log(balance)
    expect(balance).to.gt(0)

  })
  it("Should swap tokens in exact order when inputs are correct", async function () {
   let inputs = [token0, router1, token2, router2, token4]
   await flashswap.transferToMe(owner.address, token0, ethers.utils.parseEther('10') )


    await flashswap.swap(inputs)
  });
  it("Should fail to swap tokens when inputs are incorrect", async function () {
   let inputs = [token0, router1, token2, router2]

 
     await expect(flashswap.swap(inputs)).to.be.revertedWith('Incorrect inputs')
   });

   it("Should have token4 as balance", async function () {
   let inputs = [token0, router1, token2, router2, token4]

   await flashswap.transferToMe(owner.address, token0, ethers.utils.parseEther('10') )
 
     await flashswap.swap(inputs)

     let iface = [
       `function balanceOf(address user) external view returns(uint256 balance)`
     ]
     let token4Contract =  new ethers.Contract(token4, iface, owner)
     let token0Contract =  new ethers.Contract(token4, iface, owner)

     expect(await token4Contract.balanceOf(flashswap.address)).to.gt(0)
     expect(await token0Contract.balanceOf(flashswap.address)).to.be.equal(0)
   });
});