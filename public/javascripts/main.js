/**
 * Created by eric on 2017/02/18.
 *
 * External dependencies:
 * - Block.js
 * - BlockForm.js
 *
 */

// TODO langages


var blockchain = new Blockchain();
var block1 = new Block("This is my first block");
//block.mine();
//block.attachTo(blockChain);
var block2 = new Block("This is my second block");
blockchain.addBlock(block1);
blockchain.addBlock(block2);
blockchain.mine();

//block1.mine();
//block1.mine();

$(function()
{
    // The DOM is ready
    var $blockForm = new BlockForm(block1);
    $blockForm.appendTo('#main');
});

