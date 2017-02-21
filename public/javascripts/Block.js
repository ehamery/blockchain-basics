/**
 * Created by eric on 2017/02/18.
 *
 * https://en.bitcoin.it/wiki/Protocol_documentation
 *
 * External dependencies:
 * - CryptoJS.SHA256
 *
 */

function Blockchain()
{
    this.blocks = [];

    this.hashFunction = CryptoJS.SHA256;

    this.proofOfWorkCondition = "0000"; // Could just use the length

    this.firstBlockPreviousHash = "";
    for (var i = 0, HASH_SIZE = 64; i < HASH_SIZE; ++i)
    {
        this.firstBlockPreviousHash += "0";
    }
    // '0000000000000000000000000000000000000000000000000000000000000000';
    console.log("firstBlockPreviousHash: " + this.firstBlockPreviousHash);

    //this.maxMiningAttempt = 1000000;
}

Blockchain.prototype =
{
    constructor: Blockchain,
    addBlock: function(block)
    {
        var previousBlock = null;
        if (this.blocks.length > 0)
        {
            previousBlock = this.blocks[this.blocks.length-1];
        }
        else
        {
            previousBlock =
            {
                id: 0,
                hash: this.firstBlockPreviousHash
            }; // TODO make a fake block with checks
        }
        block.attachTo(this, previousBlock);

        this.blocks.push(block);

        return this;
    },
    isWorkValid: function(work)
    {
        return (work.substr(0, this.proofOfWorkCondition.length) === this.proofOfWorkCondition);
    },
    mine: function()
    {
        var block = null;
        for (var i = 0, length = this.blocks.length; i < length; ++i)
        {
            block = this.blocks[i];
            if (block.isValid())
            {
                continue;
            }
            block.mine();
        }
        return this;
    },
    work: function(data, nonce)
    {
        return this.hashFunction(data + nonce).toLocaleString();
        // return this.hashFunction(data + nonce).toString();
    }
};

function Block(/*previousBlock, */data)
{
    /*
    if (previousBlock && previousBlock instanceof Block)
    {
        this.id = previousBlock.id + 1;
        this.previousBlock = previousBlock;
    }
    else
    {
        this.id = 1;
        this.previousBlock = {hash: Block.FIRST_BLOCK_PREVIOUS_HASH};
    }
    */

    this.id = null;
    this.previousBlock = null;
    this.timestamp = Date.now();
    this.content = data || "";
    this.nonce = null; //0;
    this.hash = null;
    this.chain = null;
}

// Block 'static' members
/*
Block.LATEST_ID = 0;
Block.PROOF_OF_WORK_CONDITION = "0000"; // Could just use the length

Block.FIRST_BLOCK_PREVIOUS_HASH = "";
(function setFIRST_BLOCK_PREVIOUS_HASH()
{
    for (var i = 0, HASH_SIZE = 64; i < HASH_SIZE; ++i)
    {
        Block.FIRST_BLOCK_PREVIOUS_HASH += "0";
    }
})();
console.log("Block.FIRST_BLOCK_PREVIOUS_HASH: " + Block.FIRST_BLOCK_PREVIOUS_HASH);
*/
Block.MAX_MINING_ATTEMPT = 1000000;
/*
Block.work = function(data, nonce)
{
    return CryptoJS.SHA256(data + nonce).toLocaleString();
};
*/

Block.prototype =
{
    constructor: Block,
    attachTo: function(blockchain, previousBlock)
    {
        this.chain = blockchain;
        this.previousBlock = previousBlock;
        this.id = previousBlock.id + 1;
        return this;
    },
    mine: function()
    {
        if (!this.chain || !this.previousBlock)
        {
            throw new Error("Block need to be attached to a blockchain first");
        }

        var workInput1 = this.getWorkInput1();
        var work = null;
        for (this.nonce = 0; this.nonce < Block.MAX_MINING_ATTEMPT; ++this.nonce)
        {
            work = this.chain.work(workInput1, this.nonce);
            // TODO send event to the UI
            if (this.chain.isWorkValid(work))
            {
                this.hash = work;
                // TODO send event to the UI
                console.log("Block: " + this.id + " solved: " + this.nonce + " -> " + this.hash);
                return this.hash;
            }
        }

        throw new Error("Block: " + this.id + " COULD not be solved in a " + this.chain.maxMiningAttempt + " attempts");
        // TODO send event to the UI
    },
    getWorkInput1: function()
    {
        // return String(this.id) + this.previousBlock.hash + String(this.timestamp) + this.content;
        return String(this.id) + this.previousBlock.hash + this.content;
    },
    // get previousHash() // TODO test
    getPreviousHash: function()
    {
        return this.previousBlock.hash;
    },
    setPreviousBlock: function(block)
    {
        this.previousBlock = block;
        return this;
    },
    /*
    get hash()
    {
        return this.hash;
    },
    set content(data)
    {
        this.content = data;
    },
    */
    isValid: function()
    {
        var work = this.chain.work(this.getWorkInput1(), this.nonce);
        return this.chain.isWorkValid(work);
    }/*,
    get content()
    {
        return this.content;
    }*/
};


function BlockElement(block)
{
    this.element = $('<form/>',
    {
        // id: 'f',
        // href: 'http:/',
        // title: '',
        // rel: 'external',
        // text: '!'
    });//.appendTo('#mySelector');
}

BlockElement.prototype =
{
    constructoc: BlockElement,
    append: function(element)
    {
        this.element.appendTo(element);
    }
};


/*
Use default parameters
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters
*/
