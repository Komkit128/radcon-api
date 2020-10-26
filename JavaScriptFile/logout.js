module.exports = function (n) {
    const $ = jq;

    function logOut() {
        var act = 'logout';
        $.ajax({
            type: "POST",
            url: "main.class.php?action="+act,
            dataType: "json",
            data:pData,
            success: function (data) {
                if (data.response == 'success')
                {
                    window.location.href="index.html";
                }
            }
        });
    }

    return {
		logOut,
	}
}


