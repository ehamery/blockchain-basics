/**
 * Created by eric on 2017/02/26.
 */

function HashForm(text)
{
    text = text || '';
    var $form = $('<form/>', {class: 'form-horizontal'});
    var $fieldset = $('<fieldset/>', {class: 'well'});

    var $contentGroup = new TextAreaGroup('hashInput', 'Input', text);
    var $textArea = $contentGroup.find('textarea');
    $textArea.attr('placeholder', 'Enter some text and look at the hash it produces');
    $textArea.on('input', function(event)
    {
        var input = $(this).val();
        console.log(input);
        $hash.val(hash(input));
    });

    var $hashGroup = new InputGroup('text', 'hashOuput', 'Hash');
    var $hash = $hashGroup.find('input');
    $hash.prop('disabled', true).val(hash(text));

    $fieldset.append($contentGroup);
    $fieldset.append($hashGroup);
    $fieldset.appendTo($form);

    return $form;
}

function hash(input)
{
    return CryptoJS.SHA256(input);
}