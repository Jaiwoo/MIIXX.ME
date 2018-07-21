
//
// ─── Global Variables ─────────────────────────────────────────────────────
//

// API endpoint URLs
const MIXCLOUD_DISCOVER_URL = 'https://api.mixcloud.com/discover/';
const MIXCLOUD_EMBED_URL = 'https://mixcloud.com/oembed/'
const UNSPLASH_RANDOM_IMG_URL = 'https://api.unsplash.com/photos/random';
const QUOTES_URL = 'https://quotes.p.mashape.com/'

// jQuery DOM selectors

    // form selectors
    const timeSelector = $('#time-select');
    const genreSelector = $('#genre-select');
    const styleSelector = $('#style-select');
    const tagSelector = $('#tag-select');

    // container selectors
    const landingPage = $('#landing-container');
    const madLib = $('#form-container');
    const resultsContainer = $('#results-container')
    const mixWidget = $('#frame-container');
    const resultsControls = $('#results-ctl-container');
    const quote = $('#inspiration-container');


// other globals
let currentMixIndex = 0;
let mixResultsList = [];
let imageQuery = 'vinyl';





//
// ─── jQuery AJAX REQUEST FUNCTIONS ─────────────────────────────────────────────────────
//

    
// Unsplash Get Random Image request
function getRandomImage(callBack) {
    const settings = {
      url: `${UNSPLASH_RANDOM_IMG_URL}`,
      data: {
        query: `${imageQuery}`,
        client_id: 'cdf2e003c5fd56587721432496e946f53dcf21422a7a52212408e703929d26e5'
      },
      headers: {
        'Accept-Version': 'v1'
      },
      dataType: 'json',
      type: 'GET',
      success: callBack
    }
  
    $.ajax(settings);
  }


// Get random Quote request
function getRandomQuote(callBack) {
    const settings = {
      url: `${QUOTES_URL}`,
      data: {
        category: "motivational"
      },
      headers: {
        "X-Mashape-Key": "jsTrl47D2cmsheyjD3vClTi3z6j7p1rKf0BjsnLCpnCGKXq1nO"
      },
      dataType: "json",
      type: 'GET',
      success: callBack
    }
  
    $.ajax(settings);
  }


// Mixcloud/discover request based on user tag input
function requestMixCloudData (queryString, callBack) {

    // set up jQuery AJAX settings
    const settings = {
      url: `${MIXCLOUD_DISCOVER_URL}`+`${queryString}/`+`popular`,
      data: {
          callback: 'processMixCloudData',
          limit: 100,
      },
      dataType: 'jsonp',
      type: 'GET',
      success: callBack
    }
  
    $.ajax(settings);
  }


// Mixcloud request embed widget request
function requestEmbedWidget (item, callback) {

    const embedUrl = `${MIXCLOUD_EMBED_URL}`;
    const screenWidth = $(window).width();
    let queryHeight;
  
    if (screenWidth < 500) {
        queryHeight = 60;
    }
    else if (screenWidth > 1000) {
        queryHeight = 120;
    }
  
    const settings = {
      url: `${embedUrl}`,
      data: {
        callback: 'renderWidget',
        url: `${item.url}`,
        format: 'json',
        height: 120
      },
      dataType: 'jsonp',
      type: 'GET',
      success: callback
    }
  
    $.ajax(settings);
  }





//
// ─── AJAX RESPONSE PROCESSING FUNCTIONS ─────────────────────────────────────────
//

// process unsplash image data and set variables
function processImageResponse(response) {

    const photoCreditName = response.user.name;
    const photoCreditUsername = response.user.username;
    const photoCreditURL = `https://unsplash.com/@${photoCreditUsername}?utm_source=miixx.me&utm_medium=referral`;
  
    // insert photo data into DOM
    $('html').css({'background': 'url('+response.urls.regular+') no-repeat center center fixed', 'background-size': 'cover'});
    $('.artist-link').text(photoCreditName);
    $('.artist-link').attr("href", photoCreditURL);
  }



// process Quote data
function processQuote(response) {

    const author = response.author;
    const quoteText = `"${response.quote}"<br><br><span class="author-text">- ${author}</span>`;
  
    // insert quote data into DOM
    $('#quote-text').html(quoteText);
    $('#quote-text').fadeIn('slow');
  }



// process Mixcloud results data & filter per user input
function processMixCloudData (response) {

    // user selected time
    const userTimeLimit = timeSelector.val();
  
    // HELPER FUNCTION //
    // shuffle array of mixes returned to ensure new order for user per search
    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
  
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
  
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
  
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }
  
    // HELPER FUNCTION //
    // filter the list of mixes based on user time limit 
    function filterByTime(item) {
      if (userTimeLimit === "no time limit") {
        return true;
      }
      else if (item.audio_length < userTimeLimit && item.audio_length > (userTimeLimit*.5)) {
        return true;
      }
      else {
        return false;
      }
    }
  
    mixResultsList = response.data.filter(filterByTime);
  
    if (mixResultsList.length < 1) {
      renderNoResults();
    }
    else {
      mixResultsList = shuffle(mixResultsList);
      requestEmbedWidget(mixResultsList[currentMixIndex], renderWidget);
    }
  
    handleResultsControls();
  }

//
// ─── RESULTS RENDERING ──────────────────────────────────────────────────────────
//

// insert widget/s into page
function renderWidget(response) {
    const widget = response.embed;
    mixWidget.html(widget);
    mixWidget.fadeIn(1000);

    if (currentMixIndex > 0) {
        $('#prev-mix-btn').show();
    }
  }


function renderNoResults () {

    const noResults = 'sorry, we couldn\'t find any mixes, try adjusting your search.';
    resultsContainer.html(`<div class="no-results-text">${noResults}</div>`);
}

//
// ─── RESULTS CONTROLS HANDLING ──────────────────────────────────────────────────
//

function handleResultsControls() {

    // handle prev mix button
    $('#prev-mix-btn').on('click', function() {

        if (currentMixIndex > 0) {
            currentMixIndex--;
            mixWidget.fadeOut('slow');
            requestEmbedWidget(mixResultsList[currentMixIndex], renderWidget);
        }
        else {
            $('#prev-mix-btn').hide();
        }
      })
  
    // handle next mix button
    $('#next-mix-btn').on('click', function() {
        currentMixIndex++;
        $('#prev-mix-btn').fadeIn('slow');
        mixWidget.fadeOut('slow');
        requestEmbedWidget(mixResultsList[currentMixIndex], renderWidget);
    })
  
    // handle start over button
    $('#search-again-btn').on('click', function() {
        currentMixIndex = 0;
    
        styleSelector.hide();
        generateForm();
    
        $('.results-container').hide();
        $('#prev-mix-btn').hide();
        $('#form-container').fadeIn('slow');
    
        $('#quote-text').empty();
        $('#inspiration-container').hide();
    })
  }
  
  // handle get inspired button
  $('#get-inspired-btn').on('click', function() {
 
    if ($('#inspiration-container').css('display') === 'none') {
        $('#inspiration-container').show('slow', function() {
            getRandomQuote(processQuote);
        });
        
    }

    else {
        $('#quote-text').fadeOut('slow', function() {
            $('#quote-text').empty();
            getRandomQuote(processQuote);
        });
    }
  })


//
// ─── FORM RENDERING & SUBMIT FUNCTIONS────────────────────────────────────────────────────────
//

// update selector options on input form
function renderSelectorOptions(selector, options) {
    options.forEach(function(item) {
      selector.append(`<option value="${item.value}">${item.name}</option>`);
    })
  }

// append tag options from store based on selected genre
function renderTagOptions(selectedGenre) {

    // clear the options before re-filling
    tagSelector.html('<option value="null" disabled selected>select tag</option>');
  
    // search for user selected genre and insert tag options from global array
    tagOptions.find((obj, i) => {
      if (obj.genre === `${selectedGenre}`) {
        tagOptions[i].tags.forEach(function(item) {
          tagSelector.append(`<option value="${item.value}">${item.name}</option>`)
        })
      }
    })
  }


// generate form 
function generateForm() {

    // insert time options from global array
    timeSelector.html('<option value="no time limit" selected>no time limit</option>');
    renderSelectorOptions(timeSelector, timeOptions);

    // insert genre options from global array
    genreSelector.html('<option value="select genre" disabled selected>select genre</option>');
    renderSelectorOptions(genreSelector, genreOptions);

    // insert style options from global array
    styleSelector.html('<option value="select style" disabled selected>select style</option>');
    renderSelectorOptions(styleSelector, styleOptions);

    tagSelector.html('<option value="select tag" disabled selected>select tag</option>');
    genreSelector.change(function() {

        renderTagOptions(genreSelector.val());

        if (genreSelector.val() === "electronic") {
            styleSelector.show()
        }
        else {
            tagSelector.show();
        }
    })

    // display the submit button once form is filled out
    tagSelector.change(function() {
        $('#form-submit-container').fadeIn('fast');
    })

    handleSubmit();
}


// on form submit, assign user input to variables and prep API call
function handleSubmit() {
    $('form').on('submit', function(e) {
        e.preventDefault();
    
        const userInput = {
            selected_style: styleSelector.val(),
            selected_genre: genreSelector.val(),
            selected_tag: tagSelector.val(),
        }
    
        let queryString;

        // query Mixcloud based on electronic music style or other genres + tag
        if (userInput.selected_genre === "electronic") {
            queryString = (`${userInput.selected_style}+`+`${userInput.selected_tag}`);
        }
        else {
            queryString = (`${userInput.selected_genre}+`+`${userInput.selected_tag}`);
        }
    
        // submit API request based on user input and then process results
        requestMixCloudData(queryString, processMixCloudData);
    
        madLib.fadeOut('slow');
    
        setTimeout(() => {
            $('.results-container').fadeIn('slow');
        }, 3000);
    })
  }


//
// ─── START APP LOGIC ────────────────────────────────────────────────────────────
//

// 
function getStarted() {
    $('#get-started-btn').on('click', function() {
        generateForm();
        landingPage.fadeOut(function() {
            madLib.fadeIn();
      });
    })

    $('.new-background-btn').on('click', function () {
        getRandomImage(processImageResponse);
    })
  }

$(document).ready(function () {

    setTimeout(function(){
        $('body').addClass('loaded');
    }, 2000);

    getRandomImage(processImageResponse);
    getStarted();
  })