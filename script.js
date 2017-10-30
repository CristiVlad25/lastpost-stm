document.getElementById('refr').onclick = function() {
    $('#response').empty();
    $('#title_post').empty();
    $('#stats').empty();
    $('#vote').empty();
    $('#perc').empty();
    
};

var vote_arr = [];
 
document.getElementById('myclick').onclick = function() {  

    var accnt_name = $('#txt1').val();
  
    var query = {
        tag: accnt_name,
        limit: 20
      };

    var accnt = steem.api.getDiscussionsByBlog(query, function(err, result) {
        console.log(err, result);

        var url = 'http://steemit.com'+result[0].url;

        $('#title_post').append(err, '<a href="'+url+'">'+result[0].root_title + '</a><br><br>');

        steem.api.getAccountsAsync([accnt_name], function(err, result) {
            
            var jsn = JSON.parse(result[0].json_metadata);
            $('#title_post').append('<img id="profimg" src="'+jsn.profile.profile_image+'">by '+accnt_name+"</img><br><br>")
    
          });
        $('#stats').append(err, 'Current Payout: $'+result[0].pending_payout_value + '<br>');
        $('#stats').append(err, 'Current Replies: '+result[0].children + '<br>');
        $('#stats').append(err, 'Current Vote Count: '+result[0].net_votes + '<br><br>');
        $('#response').append('<span style="float:left">Voter</span> <span style="float:right">Percentage</span><br><br>');

        var res = result[0].active_votes;
        for (var i=0; i<res.length; i++){         
            vote_arr.push([res[i].time, res[i].voter, res[i].percent/100])   
        };

        (vote_arr.sort());

        for (var i=0; i<vote_arr.length; i++) {
            
            $('#response').append('<div id="vote"><span style="float:left">'+vote_arr[i][1]+'</span><span id="perc" style="float:right">'+vote_arr[i][2]+'</span></div><br>');
        }
        $('#response').append('<br><br><center><div id="footer"><a href="http://steemit.com/@cristi">@cristi</a></footer><br><br><center>');
      });

      // Disable the button after once pressed

      $("#myclick").attr("disabled", true);
    };










