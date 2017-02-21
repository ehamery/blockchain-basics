/**
 * Created by eric on 2017/02/22.
 */

function BlockForm(block)
{
    var $form = $('<form/>', {class: "form-horizontal"});

    //block#, timestamp, data, nonce, previous hash, hash
    // TODO +++ add name
    var $blokNbGroup = new InputGroup('number', 'block-' + block.id, 'ID', block.id);
    // var $timestampGroup = new InputGroup('number', 'timestamp-' + block.id, 'Timestamp', block.timestamp);//TODO Type
    var $contentGroup = new TextAreaGroup('content-'+ block.id, 'Content', block.content);
    var $previousHashGroup = new InputGroup('text', 'previous-hash' + block.id, 'Previous Hash', block.getPreviousHash());
    var $nonceGroup = new InputGroup('number', 'nonce-' + block.id, 'Nonce', block.nonce);
    var $hashGroup = new InputGroup('tex', 'hash' + block.id, 'Hash', block.hash);

    $form.append($blokNbGroup);
    // $form.append($timestampGroup);
    $form.append($contentGroup);
    $form.append($previousHashGroup);
    $form.append($nonceGroup);
    $form.append($hashGroup);

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
