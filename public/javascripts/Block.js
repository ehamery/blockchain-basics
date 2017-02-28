/**
 * External dependencies:
 * - CryptoJS.SHA256
 *
 * https://en.bitcoin.it/wiki/Protocol_documentation
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

    // TODO consider putting it in this.blocks
    this.blockZero =
    {
        id: 0,
        hash: this.firstBlockPreviousHash,
        isSignedAndValid: function() {return true;},
        isSigned: function() {return true;}
    }; // TODO make a fake block with checks

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
            previousBlock = this.blockZero;
        }
        block.attachTo(this, previousBlock);

        this.blocks.push(block);

        return this;
    },
    getBlock: function(blockId)
    {
        var length = this.blocks.length;
        if (0 <= blockId && blockId < length)
        {
            return this.blocks[blockId];
        }
        throw Error(blockId + ' is not a valid block ID');
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
            if (block.isSignedAndValid())
            {
                continue;
            }
            block.mine();
        }
        return this;
    },
    work: function(data, nonce)
    {
        return this.hashFunction(data + nonce).toString();
    }
};

function Block(/*previousBlock, */data)
{
    this.id = null; // WARNING: start at 1
    this.previousBlock = null;
    //this.previousHash = null;
    this.timestamp = Date.now();
    this.content = data || '';
    this.nonce = null; //0;
    this.hash = null; // signature
    this.chain = null;
}

Block.MAX_MINING_ATTEMPT = 1000000;

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

        if (!this.previousBlock.isSignedAndValid())
        {
            throw new Error("Previous block is not signed, mining it is required");
        }

        var workInput1 = this.getWorkInput1();
        var work = null;
        for (this.nonce = 0; this.nonce < Block.MAX_MINING_ATTEMPT; ++this.nonce)
        // this.nonce = (this.nonce === null) ? 0 : this.nonce;
        // for (; this.nonce < Block.MAX_MINING_ATTEMPT; ++this.nonce)
        {
            work = this.chain.work(workInput1, this.nonce);
            if (this.chain.isWorkValid(work))
            {
                this.hash = work;
                console.log("Block: " + this.id + " solved: " + this.nonce + " -> " + this.hash);
                return this.hash;
            }
        }

        throw new Error("Block: " + this.id + " COULD not be solved in a " + this.chain.maxMiningAttempt + " attempts");
        // TODO send event to the UI
    },
    getWorkInput1: function()
    {
        // return this.previousBlock.hash + String(this.id) + String(this.timestamp) + this.content;
        return this.previousBlock.hash + String(this.id) + this.content;
    },
    getNextBlock: function()
    {
        if (!this.isLastBlock())
        {
            return this.chain.blocks[this.id]; // because block.id starts at 1
        }
        return null;
    },
    isLastBlock: function()
    {
        return !(this.id < this.chain.blocks.length);
    },
    /*
    getPreviousBlockHash: function()
    {
        return this.previousBlock.hash;
    },
    */
    setPreviousBlock: function(block)
    {
        this.previousBlock = block;
        return this;
    },
    setContent: function(content)
    {
        this.content = content;
        return this;
    },
    setNonce: function(nonce)
    {
        if (typeof nonce === 'string')
        {
            this.nonce = parseInt(nonce, 10);
        }
        else if (typeof nonce === 'number')
        {
            this.nonce = nonce;
        }
        else
        {
            throw new Error("Nonce must be a parsable String or a Number");
        }
        return this;
    },
    setHash: function(hash)
    {
        this.hash = hash;
        return this;
    },
    isSigned: function()
    {
        return (this.hash !== null)
    },
    isSignedAndValid: function()
    {
        var work = this.chain.work(this.getWorkInput1(), this.nonce);
        return (work === this.hash && this.chain.isWorkValid(work));
    }
};

