/**
 * Created by eric on 2017/02/22.
 */

function BlockForm(block)
{
    // var $form = $('<form/>', {class: 'form-horizontal', id: 'block-' + block.id}).data('block', block);
    var $form = $('<form/>', {class: 'form-horizontal', id: 'block-' + block.id}).data('block-id', block.id);
    var $fieldset = $('<fieldset/>', {class: 'well'});

    //block#, timestamp, data, nonce, previous hash, hash
    // TODO +++ add name
    var $blockNbGroup = new InputGroup('number', block.id, 'ID', block.id);
    // var $timestampGroup = new InputGroup('number', 'timestamp-' + block.id, 'Timestamp', block.timestamp);//TODO Type
    var $contentGroup = new TextAreaGroup('content-'+ block.id, 'Content', block.content);
    var $previousHashGroup = new InputGroup('text', 'previous-block-hash-' + block.id, 'Previous Blcok', block.previousBlock.hash);
    var $nonceGroup = new InputGroup('number', 'nonce-' + block.id, 'Nonce', block.nonce);
    var $hashGroup = new InputGroup('text', 'hash-' + block.id, 'Hash', block.hash);
    var $mineButton = new MineButton(block);

    $blockNbGroup.find('input').prop('disabled', true);
    // $previousHashGroup.find('input').prop('disabled', true);
    // $nonceGroup.find('input').prop('disabled', true);
    // $hashGroup.find('input').prop('disabled', true);


    // for testing
    // $form.on('click', function(event, parameters, param2)
    // {
    //     console.log('click event on block #' + block.id);
    //     console.log(arguments);
    // });

    $form.on('updateBlockFormStatus-' + block.id, function(event, param1)
    {
        console.log('updateBlockFormStatus-' + block.id);
        setBlockFormStatus(block);
//        triggerUpdateNextBlockForm(block);
    });

    $contentGroup.find('textarea').on('input', function(event)
    {
        console.log($(this).val());
        block.setContent($(this).val());
        setBlockFormStatus(block);
    });

    $previousHashGroup.find('input').on('input', function(event)
    {
        console.log($(this).val());
        //block.setPreviousBlockHash($(this).val());
        if (block.previousBlock.hash !== $(this).val())
        {
            setBlockFormAsTempered(block);
        }
        else
        {
            setBlockFormStatus(block);
        }
    });

    $nonceGroup.find('input').on('input', function(event)
    {
        console.log($(this).val());
        block.setNonce($(this).val());
        setBlockFormStatus(block);
    });

    $hashGroup.find('input').on('input', function(event)
    {
        console.log($(this).val());
        block.setHash($(this).val());
        setBlockFormStatus(block);
    });

    $fieldset.append($previousHashGroup);
    $fieldset.append($blockNbGroup);
    // $fieldset.append($timestampGroup);
    $fieldset.append($contentGroup);
    $fieldset.append($nonceGroup);
    $fieldset.append($hashGroup);
    $fieldset.append($mineButton);

    $fieldset.appendTo($form);

    return $form;
}

function InputGroup(type, inputId, label, value, name)
{
    // name = name || label;
    var $inputGroup = $('<div/>', {class: 'form-group'});
    var $label = new Label(inputId, label);
    var $input = new Input(type, inputId, value/*, name*/);
    $inputGroup.append($label);
    $inputGroup.append($input);
    return $inputGroup;
}
// InputBlock.TYPE = {};
InputGroup.LABEL_GRID_CLASS = 'col-sm-2';
InputGroup.INPUT_GRID_CLASS = 'col-sm-10';
InputGroup.OFFSET_GRID_CLASS = 'col-sm-offset-2';

function TextAreaGroup(textAreaId, label, text, rows)
{
    var $inputGroup = $('<div/>', {class: 'form-group'});
    var $label = new Label(textAreaId, label);
    var $input = new TextArea(textAreaId, text, rows);
    $inputGroup.append($label);
    $inputGroup.append($input);
    return $inputGroup;
}

function Label(inputId, text)
{
    var $label = $('<label/>',
    {
        class: InputGroup.LABEL_GRID_CLASS + ' control-label',
        for: inputId,
        on: {},
        click: function() {console.log("label clicked");}
    });

    $label.text(text);
    return $label;
}

function Input(type, id, value, name)
{
    var $div = $('<div/>', {class: InputGroup.INPUT_GRID_CLASS});
    var $input = $('<input/>',
    {
        class: 'form-control',
        id: id,
        name: name,
        type: type,
        value: value
    });

    $div.append($input);
    return $div;
}

function TextArea(id, text, rows)
{
    rows = rows || 5;
    var $div = $('<div/>', {class: InputGroup.INPUT_GRID_CLASS});
    var $input = $('<textarea/>',
    {
        class: 'form-control',
        id: id,
        rows: rows
    });
    // $input.text(text); // http://api.jquery.com/text/#text1
    $input.val(text);
    $div.append($input);
    return $div;
}

function MineButton(block)
{
    var $inputGroup = $('<div/>', {class: 'form-group'});
    var $div = $('<div/>', {class: InputGroup.OFFSET_GRID_CLASS + ' ' + InputGroup.INPUT_GRID_CLASS});
    var $button = $('<button/>',
    {
        /*
         http://getbootstrap.com/javascript/#buttons
         For pre-toggled (pressed) buttons, add .active class and the aria-pressed="true"
         To enable toggling (changing between press and unpressed), add 'data-toggle': 'button'
         http://getbootstrap.com/javascript/#buttons-methods
         */
        // 'aria-pressed': true,
        autocomplete: 'off',
        class: 'btn btn-primary',
        click: function(event)
        {
            // Locking form until mining is over
            disable(block);

            // console.log(event);
            // event.preventDefault();
            console.log("Triggering mining");
            // $(this).button('toogle');
            // $(this).button('reset');
            $(this).button('mining');

            var $this = $(this);
            setTimeout(function() // required to allow button('mining') to execute first
            {
                // $this.button('test');
                try
                {
                    block.mine();
                }
                catch(error)
                {
                    alert(error); // TODO display something nicer
                    $this.button('reset');
                    disable(block, false);
                    throw(error);
                }

                // $this.button('signed');
                // updateBlockForm(block);
                setBlockFormOnceAndHashes(block);
                setBlockFormAsSigned(block);
                // triggerUpdateNextBlockForm(block);// TEST
                // setBlockFormStatus(block);
                $this.button('reset');
                disable(block, false);

            // }, 1000); // 1 seconds to have the time the realised it is mining
            }, 0);

            //$( "p" ).trigger( "myCustomEvent", [ "John" ] );
            // return false;
        },
        // class: 'btn btn-primary active',
        'data-signed-text': 'Signed',
        'data-mining-text': 'Mining...',
        // 'data-reset-text': 'Resetting...',
        'data-test-text': 'testing...',

        // 'data-toggle': 'button',
        'autocomplete': "off",
        id: 'mine-button-' + block.id,
        on:
        {
            mine: function()
            {
                console.log('mining...');
            }
        },
        text: 'Mine',
        type: 'button'
    });
    $div.append($button);
    $inputGroup.append($div);
    return $inputGroup;
}




function getBlockForm(block)
{
    return $('#block-' + block.id);
}

function disable(block, lock)
{
    lock = (lock == undefined) ? true : lock;
    var $blockForm = getBlockForm(block);
    $blockForm.find('fieldset').prop('disabled', lock);
}

function setBlockFormOnceAndHashes(block)
{
    var $blockForm = getBlockForm(block);
    // Set previous block's hash
    $blockForm.find('#previous-block-hash-' + block.id).val(block.previousBlock.hash);
    // Set nonce
    $blockForm.find('#nonce-' + block.id).val(block.nonce);
    // Set hash
    $blockForm.find('#hash-' + block.id).val(block.hash);
}


function setBlockFormAsNew(block)
{
    var $blockForm = getBlockForm(block);
    $blockForm.find('.well').removeClass('tempered').removeClass('signed');
}

function setBlockFormAsSigned(block)
{
    var $blockForm = getBlockForm(block);
    // Set signed color (green)
    $blockForm.find('.well').removeClass('tempered').addClass('signed');

//   triggerUpdateNextBlockForm(block);
}

function triggerUpdateNextBlockForm(block)
{
    var nextBlock = block.getNextBlock();
    if (!block.isLastBlock())
    {
        var nextBlockId =  block.id + 1;
        var event = $.Event('updateBlockFormStatus-' + nextBlockId/*, {blockId: nextBlockId}*/ );
        // $("form .well").trigger(event);
        var $nextForm = $('#block-' + nextBlockId);
        $('#block-' + nextBlockId).trigger(event);
        // $('#block-' + nextBlockId).trigger('click', 'params');
    }
    else
    {
        console.log('Last block was reach');
    }
}

function setBlockFormAsTempered(block)
{
    // $('#block-' + block.id + ' .well').removeClass('signed').addClass('tempered');
    // TODO use block.chain!
    $('form').each(function(index, form)
    {
        var $form = $(form);
        //console.log(arguments);
        if ($form.data().blockId >= block.id)
        {
            $form.find('.well').removeClass('signed').addClass('tempered');
        }
    });
}


function setBlockFormStatus(block)
{
    if (block.isSignedAndValid())
    {
        setBlockFormAsSigned(block);
    }
    else if (!block.isSigned())
    {
        setBlockFormAsNew(block);
    }
    else
    {
        setBlockFormAsTempered(block);
    }

    // triggerUpdateNextBlockForm(block);
}

/*
function getBlockFormId(block)
{
    return 'block-' + block.id;
}

function getBlockFormSelector(block)
{
    return '#' + block-' + block.id;
}

function getBlockForm(block)
{
    return $(getBlockFormSelector(block));
}

function updateBlockFormField(block)
{
    var $blockFrom = $('#block-' + block.id);
}
*/
