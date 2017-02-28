/**
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
var block3 = new Block('This is my third block');
blockchain.addBlock(block1);
// blockchain.addBlock(block2);
// blockchain.addBlock(block3);
// block1.mine();
// block1.mine();
// blockchain.mine();

$(function()
{
    // The DOM is ready

    var $blockchainDiv = $('#blockchain');
    var $blockForm1 = new BlockForm(block1);
    // var $blockForm2 = new BlockForm(block2);
    // var $blockForm3 = new BlockForm(block3);
    // $blockForm1.appendTo('#main');
    $blockchainDiv.append($blockForm1);
    // $blockchainDiv.append($blockForm2);
    // $blockchainDiv.append($blockForm3);
    // $blockchainDiv.prepend($blockForm1);
    // $blockchainDiv.prepend($blockForm2);

    //TODO could use $mainDiv.after($blockForm1)

    var $addBlockButton = $('#add-block-button');
    $addBlockButton.click(function()
    {
        var block = new Block();
        blockchain.addBlock(block);
        //block.mine(); // FOR TESTING
        $('#blockchain').append(new BlockForm(block));
    });
});

