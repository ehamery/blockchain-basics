/**
 * Created by eric on 2017/02/27.
 * TODO: Add a stop button!
 */

var MIN_LEADING_ZEROS = 1;
var MAX_LEADING_ZEROS = 7; // Above 7, it will likely take too much time
var DEFAULT_LEADING_ZEROS = MIN_LEADING_ZEROS;

function WorkForm(text)
{
    text = text || '';
    var nonce = 0;
    var $form = $('<form/>', {class: 'form-horizontal'});
    var $fieldset = $('<fieldset/>', {class: 'well'});

    var $contentGroup = new TextAreaGroup('hashInput', 'input', text);
    var $textArea = $contentGroup.find('textarea');
    $textArea.attr('placeholder', 'Enter some text here, or not!');
    $textArea.on('input', function(event)
    {
        update();
    });

    var $nonceGroup = new InputGroup('number', 'nonce', 'nonce', nonce);
    $nonceGroup.find('input').on('input', function(event)
    {
        update();
    });

    var $difficultyGroup = new InputGroup('number', 'difficulty', 'Leading zeros', DEFAULT_LEADING_ZEROS);
    var $difficultyInput = $difficultyGroup.find('input');
    $difficultyInput.attr('min', MIN_LEADING_ZEROS).attr('max', MAX_LEADING_ZEROS);
    $difficultyInput.on('input', function(event)
    {
        update();
    });

    var $hashGroup = new InputGroup('text', 'hashOutput', 'hash(input + nonce)');
    var $hash = $hashGroup.find('input');
    $hash.prop('disabled', true).val(hash(text+nonce));

    var $workButton = new WorkButton();

    $fieldset.append($contentGroup);
    $fieldset.append($nonceGroup);
    $fieldset.append($hashGroup);
    $fieldset.append($difficultyGroup);
    $fieldset.append($workButton);
    $fieldset.appendTo($form);

    return $form;
}

function hash(input)
{
    return CryptoJS.SHA256(input).toString();
}

function work(nonce, input)
{
    input = (input !== undefined) ? input : $('#hashInput').val();
    nonce = (nonce !== undefined) ? nonce : $('#nonce').val();

    var hashOutput = hash(input + nonce);
    // console.log(hashOutput);
    return hashOutput;
}

function update()
{
    var hashOutput = work();
    $('#hashOutput').val(hashOutput);
    var proofOfWorkCondition = getProofOfWorkCondition();
    setWorkDone(hashOutput.substr(0, proofOfWorkCondition.length) === proofOfWorkCondition);
}

function WorkButton()
{
    var $inputGroup = $('<div/>', {class: 'form-group'});
    var $div = $('<div/>', {class: InputGroup.OFFSET_GRID_CLASS + ' ' + InputGroup.INPUT_GRID_CLASS});
    var $button = $('<button/>',
    {
        autocomplete: 'off',
        class: 'btn btn-primary',
        click: function(event)
        {
            // Locking form until work is over
            $('form').find('fieldset').prop('disabled', true);
            $(this).button('working');// asynchronous

            var $this = $(this);
            /*
            setTimeout(function() // required to allow button('working') to execute first
            {
                try
                {
                    findMatch();
                }
                catch(error)
                {
                    alert(error); // TODO display something nicer
                    $this.button('reset');
                    $('form').find('fieldset').prop('disabled', false);
                    throw(error);
                }
                $this.button('reset');
                $('form').find('fieldset').prop('disabled', false);
            }, 100);
            */
            findMatchAsync(function(error, hash)
            {
                if (error)
                {
                    alert(error);
                    $this.button('reset');
                    $('form').find('fieldset').prop('disabled', false);
                    return;
                }
                $this.button('reset');
                $('form').find('fieldset').prop('disabled', false);
                console.log('[callback] Match found: ' + $('#nonce').val() + '=> ' + $('#hashOutput').val());
            });
        },
        'data-working-text': 'Working...',
        'autocomplete': "off",
        id: 'work-button',
        on:
        {
            work: function()
            {
                console.log('working...');
            }
        },
        text: 'Find a match',
        type: 'button'
    });
    $div.append($button);
    $inputGroup.append($div);
    return $inputGroup;
}

// Does not allow display update...
function findMatch()
{
    var hashInput = $('#hashInput').val();
    var proofOfWorkCondition = getProofOfWorkCondition();
    var $nonce = $('#nonce');
    var nonce = $nonce.val();

    var hashOutput = null;
    for (; nonce < Block.MAX_MINING_ATTEMPT; ++nonce)
    {
        hashOutput = work(nonce, hashInput);
        updateFormSometimes(nonce, hashOutput); // Useless...

        if ((hashOutput.substr(0, proofOfWorkCondition.length) === proofOfWorkCondition))
        {
            console.log('Match found: ' + nonce + '=> ' + hashOutput);
            $nonce.val(nonce);
            $('#hashOutput').val(hashOutput);
            setWorkDone(true);
            return hashOutput;
        }
    }

    throw new Error( "Could not find a match in  " + Block.MAX_MINING_ATTEMPT + " attempts");
}

function findMatchAsync(callback)
{
    var hashInput = $('#hashInput').val();
    var proofOfWorkCondition = getProofOfWorkCondition();
    var $nonce = $('#nonce');
    var nonce = $nonce.val();
    var $hashOutput = $('#hashOutput');
    var hashOutput = null;

    (function findAMatch(nonce)
    {
        // console.log("nonce: " + nonce); // Heavy on the browser
        if (nonce >= Block.MAX_MINING_ATTEMPT)
        {
            callback(new Error( "Could not find a match in  " + Block.MAX_MINING_ATTEMPT + " attempts"))
            return;
        }

        setTimeout(function ()
        {
            var random = Math.floor((Math.random() * 100) + 1); // [1, 100]
            var limit = Math.min(Block.MAX_MINING_ATTEMPT, nonce + random);

            for (; nonce < limit; ++nonce)
            {
                hashOutput = work(nonce, hashInput);
                // updateFormSometimes(nonce, hashOutput);

                if ((hashOutput.substr(0, proofOfWorkCondition.length) === proofOfWorkCondition))
                {
                    console.log('Match found: ' + nonce + '=> ' + hashOutput);
                    $nonce.val(nonce);
                    $hashOutput.val(hashOutput);
                    setWorkDone(true);
                    callback(null, hashOutput);
                    return;
                }
            }

            $nonce.val(nonce);
            $hashOutput.val(hashOutput);
            // findAMatch(++nonce);
            findAMatch(nonce);
        }, 0);
    })(nonce);
}

function getProofOfWorkCondition()
{
    var difficulty = $('#difficulty').val();
    var proofOfWorkCondition = '';
    for (var i = 0; i < difficulty; ++i)
    {
        proofOfWorkCondition += '0';
    }
    return proofOfWorkCondition;
}

function updateFormSometimes(nonce, hashOutput)
{
    // Update randomly, updating everytime is too heavy
    if (Math.floor((Math.random() * 100) + 1)  === 100) // [1, 100]
    {
        console.log('updateFormSometimes ' + nonce + '=> '+ hashOutput);
        $('#nonce').val(nonce);
        $('#hashOutput').val(hashOutput);
    }
}

function setWorkDone(trueOrFalse)
{
    if (trueOrFalse)
    {
        $('fieldset').addClass('signed');
    }
    else
    {
        $('fieldset').removeClass('signed');
    }
}
