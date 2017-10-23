(function($, window, document, undefined) {
    // feature detection for drag&drop upload
    var isAdvancedUpload = function() {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }();

    var $form = $('.markdownEditor');
    var $errorMsg = $form.find('.markdown_box__error span');
    var $successMsg = $form.find('.markdown_box__success span');

    console.log($form);

    // if the form was submitted
    $form.on('submit', function(e) {
        // preventing the duplicate submissions if the current one is in progress
        if ($form.hasClass('is-uploading')) {
            return false;
        }
        $form.addClass('is-uploading').removeClass('is-error');
        if (isAdvancedUpload) { // ajax file upload for modern browsers
            e.preventDefault();
            // gathering the form data
            var ajaxData = new FormData($form.get(0));
            // ajax request
            $.ajax({
                url: $form.attr('action'),
                type: $form.attr('method'),
                data: ajaxData,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                complete: function() {
                    $form.removeClass('is-uploading');
                },
                success: function(data) {
                    if (data.success == true) {
                        $form.addClass('is-success');
                        $successMsg.html('Saved data');
                    } else {
                        $form.addClass('is-error');
                        $errorMsg.text(data.error);
                    }
                },
                error: function() {
                    alert('Error. Please, contact the webmaster!');
                }
            });
        } else { // fallback Ajax solution upload for older browsers
            var iframeName = 'uploadiframe' + new Date().getTime(),
            $iframe = $('<iframe name="' + iframeName + '" style="display: none;"></iframe>');
            $('body').append($iframe);
            $form.attr('target', iframeName);
            $iframe.one('load', function() {
                var data = $.parseJSON($iframe.contents().find('body').text());
                $form.removeClass('is-uploading').addClass(data.success == true ? 'is-success' : 'is-error').removeAttr('target');
                if(!data.success) $errorMsg.text(data.error);
                $iframe.remove();
            });
        }
    });
})(jQuery, window, document);
