var power;
var rewardFund;
var price;
var sP;
var VotingPower;
var VotingWeight;
var vvl;
var voteVal;
var voting;

function dynamicGlobal () {
    
    steem.api.getDynamicGlobalProperties(function(errDG, resultDG) {
    
        power = sP/(parseFloat(resultDG['total_vesting_fund_steem'].split(' ')[0])/
                    parseFloat(resultDG['total_vesting_shares'].split(' ')[0]));

        console.log(power); //this is NaN because of sP

});};

function getRewardFund() {

    steem.api.getRewardFund('post', function(errRF, resultRF) {
        
        rewardFund = parseFloat(resultRF['reward_balance'].split(' ')[0])/
                        parseFloat(resultRF['recent_claims']);

        console.log(rewardFund);
});};

function getCurrentMedianHistoryPrice() {

    steem.api.getCurrentMedianHistoryPrice(function(errCM, resultCM) {
        
        price = parseFloat(resultCM['base'].split(' ')[0])/parseFloat(resultCM['quote'].split(' ')[0]);
        console.log(price);

});};

function getVoteValue(sP, VotingPower, VotingWeight) {
    
    voting = parseFloat(((100 * VotingPower * (100 * VotingWeight) / 10000) + 49) / 50);
    voteVal = parseFloat(( power * voting * 100) * rewardFund * price);
    console.log(voteVal);

};

function getSteemPower(username) {
    return Promise.all([
        steem.api.getAccounts([username]),
        steem.api.getDynamicGlobalProperties()
    ]).then(([user, globals]) => {
        const totalSteem = Number(globals.total_vesting_fund_steem.split(' ')[0]);
        const totalVests = Number(globals.total_vesting_shares.split(' ')[0]);
        const userVests = Number(user[0].vesting_shares.split(' ')[0]);
        const delegVests = Number(user[0].delegated_vesting_shares.split(' ')[0]);

        sP = totalSteem * ( (userVests-delegVests) / totalVests);
    
    });
};

var voteClick = function() {

        $('.loader').addClass("show-loader");
        voter_name = $('#txt2').val();
        voter_weight = parseFloat($('#txt3').val());
    
        getSteemPower(voter_name);
        dynamicGlobal();
        getCurrentMedianHistoryPrice();
        getRewardFund();
    
        steem.api.getAccounts([voter_name], function(err, resultVo) {
            VotingPower = parseFloat(resultVo[0].voting_power/100);
            console.log(VotingPower);
            getVoteValue(sP, VotingPower, voter_weight);
            $('#responseCalc').append('The Current Vote Value of @'+voter_name+' at '+voter_weight+'%'+' is: $'+voteVal.toFixed(2));
            $('.loader').addClass("hide-loader");
        });

        $("#voteClick").attr("disabled", true);
    };
