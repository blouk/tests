/**
 * Created by Faiz on 02-03-2015.
 */

// Create a JS Class to easyly maintains for the futur
var Calculator = function() {
    var self = this;
    this.options = {
        legend: {
            position: 'bottom',
            alignment: 'center',
            maxLines: 1,
            textStyle: {
                color: 'black',
                fontSize: 16,
                bold: true
            }
        },
        pieHole: 0.5,
        pieSliceText: 'none',
        slices: {
            0: {
                color: '#3bafda'
            },
            1: {
                color: '#c80529'
            }
        },
        tooltip: 'none',
        animation: {'startup': true}

    };

    this.homePrice = $('#home_price').slider()
        .on('slide', {
            self: self
        }, self.update)
        .data('slider');

    this.downPayment = $('#down_payment').slider()
        .on('slide', {
            self: self
        }, self.update)
        .data('slider');

    this.intRate = $('#interest_rate').slider()
        .on('slide', {
            self: self
        }, self.update)
        .data('slider');

    this.longTerm = $('#long_term').slider()
        .on('slide', {
            self: self
        }, self.update)
        .data('slider');

    this.update();

};

Calculator.prototype.update = function(e) {
    (e) ? e.data.self.setValues(): this.setValues();
    (e) ? e.data.self.updateView(): this.updateView();
    (e) ? e.data.self.drawChart(): this.drawChart();
};

Calculator.prototype.updateView = function() {
    // update Sliders values
    // --- Home price
    $('#home_price_value').text(this.homePriceValue).priceFormat({
        prefix: '',
        suffix: '  <small>AED</small>',
        centsLimit: 0,
        thousandsSeparator: ' '
    });
    $('#down_payment_value').text(parseInt(this.downPaymentValue)).priceFormat({
        prefix: '',
        suffix: ' <small> AED</small>',
        centsLimit: 0,
        thousandsSeparator: ' '
    });
    $('#down_payment_percent').text(parseInt(this.downPayment.getValue()) + ' %');
    $('#calculated_loan_amount').val(parseInt(this.homePriceValue * (1 - this.downPaymentValue)));
    // --- Interest rate
    $('#interest_rate_value').text(parseFloat(this.intRate.getValue()).toFixed(2) + ' %');
    $('#interest_rate').val(parseFloat(this.intRate.getValue()).toFixed(2));
    // --- Term Val
    $('#long_term_value').text(parseInt(this.longTermValue) + ' years');


    $('#calculated_loan_amount').val(this.loanAmount);
    $('#down_payment_percent').text(parseInt(this.downPayment.getValue()) + ' %');
    $('#interest_rate_value').text(parseFloat(this.intRate.getValue()).toFixed(2) + ' %');
    $('#long_term_value').text(parseInt(this.longTerm.getValue()) + ' years');

    $('#display_principal').text(this.currencyFormat(this.principal, 0));
    $('#display_interest').text(this.currencyFormat(this.interest, 0));
    $('#display_monthly_payment').text(this.currencyFormat(this.monthlyPayment, 0));
    $('#display_loan_amount').text(this.currencyFormat(this.loanAmount, 0));


    $('#display_land_dept_fee').text(this.currencyFormat(this.landDeptFee, 0));
    $('#display_registration_fee').text(this.currencyFormat(this.registrationFee, 0));
    $('#display_mortgage_registration').text(this.currencyFormat(this.mortgageRegistration, 0));
    $('#display_broker_commission').text(this.currencyFormat(this.brokerCommission, 0));
    $('#display_mortgage_processing').text(this.currencyFormat(this.mortgageProcessing, 0));
    $('#display_conveyance').text(this.currencyFormat(this.conveyance, 0));
    $('#display_valuation').text(this.currencyFormat(this.valuation, 0));

    $('#display_down_payment').text(this.currencyFormat(this.downPaymentValue, 0));
    $('#display_total_extra').text(this.currencyFormat(this.totalExtra, 0));
    $('#display_total_paid_interest').text(this.currencyFormat(this.totalPaidInterest, 0));
    $('#display_required_upfront').text(this.currencyFormat((this.downPaymentValue + this.totalExtra), 0));

    $('#monthly_payment').val(this.monthlyPayment.toFixed(2));

    $('#monthly_payment_calculated').text(this.currencyFormat(this.monthlyPayment, 0));

};

Calculator.prototype.setValues = function() {

    this.homePriceValue = parseInt(this.homePrice.getValue());
    this.downPaymentValue = parseInt(this.downPayment.getValue()) / 100;
    this.interestRateValue = parseFloat(this.intRate.getValue() / 100).toFixed(2);
    this.longTermValue = parseInt(this.longTerm.getValue());
    this.loanAmount = this.homePriceValue - (this.homePriceValue * this.downPaymentValue);

    this.numPayments = this.longTermValue * 12;
    this.monthlyInterest = this.interestRateValue / 12;
    this.term = Math.pow((1 + this.monthlyInterest), this.numPayments);
    this.monthlyPayment = this.loanAmount * (this.monthlyInterest * this.term / (this.term - 1));
    this.interest = parseFloat(((41.81 / 100) * this.monthlyPayment).toFixed(0));
    this.principal = parseFloat(((58.19 / 100) * this.monthlyPayment).toFixed(0));

    this.landDeptFee = (this.homePriceValue * 0.04) + 540;
    this.registrationFee = 4000;
    this.mortgageRegistration = this.loanAmount * (0.25 / 100) + 10;
    this.brokerCommission = this.homePriceValue * 0.02;
    this.mortgageProcessing = this.loanAmount * 0.01;
    this.conveyance = 8000;
    this.valuation = 3000;
    this.downPaymentValue = this.homePriceValue * this.downPaymentValue;
    this.totalExtra = this.landDeptFee + this.registrationFee + this.mortgageRegistration + this.brokerCommission + this.mortgageProcessing + this.conveyance + this.valuation;
    this.totalPaidInterest = this.monthlyPayment * this.term * 12;

};


Calculator.prototype.drawChart = function(interestAmt, principalAmt) {

    var data = new google.visualization.arrayToDataTable([
        ['Task', 'Monthly Payments'],
        ['Interest', this.interest],
        ['Principal', this.principal]
    ]);
    var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, this.options);
};


Calculator.prototype.currencyFormat = function(num, precision) {
    return num.toFixed(precision).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
};

$(function() {

    // General UI Events
    $('#read-more-content').readmore({
        moreLink: '<div id="read-more"> <a href="#"> See details </a> <span class="glyphicon glyphicon-traingle-bottom"></span></div>',
        lessLink: '<div id="read-less"><a href="#"> Show less <span class="glyphicon glyphicon-traingle-up"></span> </a></div>',
        embedCSS: false,
        speed: 300,
        afterToggle: function(trigger, element, expanded) {
            if (!expanded) { // The "Close" link was clicked
                $('html, body').animate({
                    scrollTop: element.offset().top
                }, {
                    duration: 100
                });
            }
        }
    });

    $('.logos').slick({
        autoplay: true,
        speed: 1000,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1
    });
    
    google.charts.setOnLoadCallback(function() {
        calculator = new Calculator();
    });
});

// start the application after loading google chart
var calculator;
 google.charts.load('current', {packages: ['corechart']});
