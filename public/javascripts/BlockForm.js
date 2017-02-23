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
    var $blockNbGroup = new InputGroup('number', 'id-' + block.id, 'ID', block.id);
    // var $timestampGroup = new InputGroup('number', 'timestamp-' + block.id, 'Timestamp', block.timestamp);//TODO Type
    var $contentGroup = new TextAreaGroup('content-'+ block.id, 'Content', block.content);
    var $previousHashGroup = new InputGroup('text', 'previous-hash-' + block.id, 'Previous Hash', block.getPreviousHash());
    var $nonceGroup = new InputGroup('number', 'nonce-' + block.id, 'Nonce', block.nonce);
    var $hashGroup = new InputGroup('text', 'hash-' + block.id, 'Hash', block.hash);
    var $mineButton = new MineButton(block);

    $fieldset.append($blockNbGroup);
    // $fieldset.append($timestampGroup);
    $fieldset.append($contentGroup);
    $fieldset.append($previousHashGroup);
    $fieldset.append($nonceGroup);
    $fieldset.append($hashGroup);
    $fieldset.append($mineButton);

    $fieldset.appendTo($form);

    return $form;
}

function InputGroup(type, inputId, label, value)
{
    var $inputGroup = $('<div/>', {class: 'form-group'});
    var $label = new Label(inputId, label);
    var $input = new Input(type, inputId, value);
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

function Input(type, id, value)
{
    var $div = $('<div/>', {class: InputGroup.INPUT_GRID_CLASS});
    var $input = $('<input/>',
    {
        class: 'form-control',
        id: id,
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
    $input.text(text);
    $div.append($input);
    return $div;
}

function InputGroup(type, inputId, label, value)
{
    var $inputGroup = $('<div/>', {class: 'form-group'});
    var $label = new Label(inputId, label);
    var $input = new Input(type, inputId, value);
    $inputGroup.append($label);
    $inputGroup.append($input);
    return $inputGroup;
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
        // class: 'btn btn-primary active',
        'data-signed-text': 'Signed',
        'data-mining-text': 'Mining...',
        // 'data-reset-text': 'Resetting...',
        'data-test-text': 'testing...',

        // 'data-toggle': 'button',
        'autocomplete': "off",
        id: 'block-' + block.id,
        on:
        {
            mine: function()
            {
                console.log('mining...');
            },
            click: function(event)
            {
                // console.log(event);
                // event.preventDefault();
                console.log("Tiggering mining");
                // $(this).button('toogle');
                // $(this).button('reset');
                $(this).button('mining');
                var $this = $(this);

                // required to allow button('mining') to execute first
                setTimeout(function()
                {
                    // $this.button('test');
                    try
                    {
                        block.mine();
                        // TODO change well background color
                        //$this.button('signed');
                        $this.button('reset');
                    }
                    catch(error)
                    {
                        alert(error);
                        $this.button('reset');
                        throw(error);
                    }
                }, 1000); // 1 seconds to have the time the realised it is mining

                //$( "p" ).trigger( "myCustomEvent", [ "John" ] );
                // return false;
            }
        },
        text: 'Mine',
        type: 'button'
    });
    $div.append($button);
    $inputGroup.append($div);
    return $inputGroup;
}

