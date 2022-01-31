//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


import "hardhat/console.sol";


contract Flashswap is Ownable {
    function swap(
        address[] memory inputs,     // This is the path. Path is a list of [token0, token1]. The contract swap token0 to token1
        uint256 deadline
    ) external {

        // loop through the inoputs

        for (uint i=0; i < inputs.length; i+=3) {
            address token0 = inputs[i - 1];
            IUniswapV2Router02 router = IUniswapV2Router02(inputs[i+1]);
            address token1 = inputs[i+2];

            if (i != 0) {
                token0 = inputs[i];
            }
           
            uint256 amountIn = IERC20(token0).balanceOf(msg.sender);
            address[] memory path = new address[](2);
            path[0] = token0;
            path[1] = token1;

            router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                amountIn,
                0,
                path,
                msg.sender,
                deadline
            );
        }
   
    }

}

