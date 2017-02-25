/**
 * Created by eric on 2017/02/18.
 *
 * External dependencies:
 * - Block.js
 * - BlockForm.js
 *
 */

// TODO add langage support

var blockchain = new Blockchain();
var block1 = new Block('This is my first block');
//block.mine();
//block.attachTo(blockChain);
var block2 = new Block('This is my second block');
blockchain.addBlock(block1);
blockchain.addBlock(block2);
// block1.mine();
// block1.mine();
// blockchain.mine();

$(function()
{
    // The DOM is ready
    var $blockchainDiv = $('#blockchain');
    var $blockForm1 = new BlockForm(block1);
    var $blockForm2 = new BlockForm(block2);
    // $blockForm1.appendTo('#main');
    $blockchainDiv.append($blockForm1);
    $blockchainDiv.append($blockForm2);
    // $blockchainDiv.prepend($blockForm1);
    // $blockchainDiv.prepend($blockForm2);

    //TODO could use $mainDiv.after($blockForm1)
});

