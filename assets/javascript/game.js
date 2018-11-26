$(document).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: 'AIzaSyCviNrg0BFuKpH_S23NJmJh-kmhaMaa6Us',
    authDomain: 'rpsm-f4995.firebaseapp.com',
    databaseURL: 'https://rpsm-f4995.firebaseio.com',
    projectId: 'rpsm-f4995',
    storageBucket: '',
    messagingSenderId: '792785874613'
  };
  firebase.initializeApp(config);

  // Alias database and sub-levels.
  var database = firebase.database();

  // create root node for players
  var playersRef = database.ref('/players/');
  var turnRef = database.ref('/turn');
  var player1, player2, player1Stats, player2Stats;

  // add listener to players node
  playersRef.on('value', function(snapshot) {
    // player 1

    if (snapshot.child('player1').exists()) {
      player1 = true;
      player1Stats = snapshot.child('player1').val();
      $('#messages1').html('');
    } else {
      player1 = false;
      $('#messages1').html('Waiting for player 1...');
      // hide player1 console
      $('#player1_content').hide();
    }

    // player 2
    if (snapshot.child('player2').exists()) {
      player2 = true;
      player2Stats = snapshot.child('player2').val();
      $('#messages2').html('');
    } else {
      player2 = false;
      $('#messages2').html('Waiting for player 2...');
      // hide player2 console
      $('#player2_content').hide();
    }

    if (snapshot.numChildren() === 2) {
      $('#player').html(`<h5>Player 1: ${
        snapshot.child('player1').val().name
      } is playing Player 2: ${
        snapshot.child('player2').val().name
      }</h5> <hr> <button class="btn waves-effect waves-light reset" type="submit" name="action">Reset
              <i class="material-icons right">send</i>
            </button>`);
      // change names of Player 1 and 2
      $('#player1_name').text(snapshot.child('player1').val().name);
      $('#player2_name').text(snapshot.child('player2').val().name);
      // show player consoles
      $('#player1_content').show();
      $('#player2_content').show();
    }
  });

  var turn = 1;
  turnRef.on('value', function(snapshot) {
    console.log(snapshot.exists());
    if (snapshot.exists()) {
      turn = snapshot.val().turn;
    } else {
      turn = 1;
    }
    turnRef.set({ turn: turn });

    if (turn === 1) {
      $('#player1_content *').addClass('player1_selects');
      $('#player2_content *').removeClass('player2_selects');
      $('#player1_content *').show();
      $('#player2_content *').hide();
    }
    if (turn === 2) {
      $('#player2_content *').addClass('player2_selects');
      $('#player1_content *').removeClass('player1_selects');
      $('#player2_content *').show();
      $('#player1_content *').hide();
    }
  });

  // Monitor Player1's selection
  $(document).on('click', '.player1_selects', function(event) {
    event.preventDefault();

    // Make selections only when both players are in the game
    if (player1 && player2 && turn === 1) {
      // Record player1's choice
      var choice = $(this)
        .text()
        .trim();

      // Record the player choice into the database
      player1Stats.choice = choice;
      database
        .ref()
        .child('/players/player1/choice')
        .set(choice);

      // Set the turn value to 2, as it is now player2's turn
      turn = 2;
      turnRef.set({ turn: turn });
    }
  });

  // Monitor Player1's selection
  $(document).on('click', '.player2_selects', function(event) {
    event.preventDefault();
    console.log('Player:' + player1);
    console.log('Player:' + player1);
    console.log('Turn:' + turn);
    if (player1 && player2 && turn === 2) {
      // Record player2's choice
      var choice = $(this)
        .text()
        .trim();

      // Record the player choice into the database
      player1Stats.choice = choice;
      database
        .ref()
        .child('/players/player2/choice')
        .set(choice);

      // Compare player1 and player 2 choices and record the outcome
      rps();
      console.log('player1.choice:' + player1Stats.choice);
      console.log('player2.choice:' + player1Stats.choice);
    }
  });

  function rps() {
    if (player1Stats.choice === 'Rock') {
      if (player2Stats.choice === 'Rock') {
        // Tie
        console.log('tie');

        playersRef.child('player1/tie').set(player1Stats.tie + 1);
        playersRef.child('player2/tie').set(player2Stats.tie + 1);
      } else if (player2Stats.choice === 'Paper') {
        // Player2 win
        console.log('paper win');
        $('#messages').html('Player 2 wins!');

        playersRef.child('player1/loss').set(player1Stats.loss + 1);
        playersRef.child('player2/win').set(player2Stats.win + 1);
      } else {
        // scissors
        // Player1 win
        console.log('rock win');
        $('#messages').html('Player 1 wins!');

        playersRef.child('player1/win').set(player1Stats.win + 1);
        playersRef.child('player2/loss').set(player2Stats.loss + 1);
      }
    } else if (player1Stats.choice === 'Paper') {
      if (player2Stats.choice === 'Rock') {
        // Player1 win
        console.log('paper win');
        $('#messages').html('Player 1 wins!');

        playersRef.child('player1/win').set(player1Stats.win + 1);
        playersRef.child('player2/loss').set(player2Stats.loss + 1);
      } else if (player2.choice === 'Paper') {
        // Tie
        console.log('tie');

        playersRef.child('player1/tie').set(player1Stats.tie + 1);
        playersRef.child('player2/tie').set(player2Stats.tie + 1);
      } else {
        // Scissors
        // Player2 win
        console.log('scissors win');
        $('#messages').html('Player 2 wins!');

        playersRef.child('player1/loss').set(player1Stats.loss + 1);
        playersRef.child('player2/win').set(player2Stats.win + 1);
      }
    } else if (player1Stats === 'Scissors') {
      if (player2Stats === 'Rock') {
        // Player2 win
        console.log('rock win');
        $('#messages').html('Player 2 wins!');

        playersRef.child('player1/loss').set(player1Stats.loss + 1);
        playersRef.child('player2/win').set(player2Stats.win + 1);
      } else if (player2Stats === 'Paper') {
        // Player1 win
        console.log('scissors win');
        $('#messages').html('Player 1 wins!');

        playersRef.child('player1/win').set(player1Stats.win + 1);
        playersRef.child('player2/loss').set(player2Stats.loss + 1);
      } else {
        // Tie
        console.log('tie');

        playersRef.child('player1/tie').set(player1Stats.tie + 1);
        playersRef.child('player2/tie').set(player2Stats.tie + 1);
      }
    }

    turnRef.set({ turn: 1 });
  }

  // reset button
  $(document).on('click', '.reset', function() {
    playersRef.child('player1').remove();
    playersRef.child('player2').remove();
    turnRef.set({ turn: 1 });
    location.reload();
  });

  // submit button functionality
  var counter = 0;
  $('#submit').on('click', function(e) {
    e.preventDefault();

    if (counter === 0) {
      var name = $('#name')
        .val()
        .trim();

      if (name !== '') {
        if (!player1) {
          player1Stats = {
            name: name,
            choice: '',
            win: 0,
            loss: 0,
            tie: 0
          };
          playersRef.child('player1').set(player1Stats);
        } else if (!player2) {
          player2Stats = {
            name: name,
            choice: '',
            win: 0,
            loss: 0,
            tie: 0
          };
          playersRef.child('player2').set(player2Stats);
        }
      }
    }
    counter++;
  });

  // Chat functionality
  $('#chatBtn').on('click', function(event) {
    // event.preventDefault();

    // First, make sure that the player exists and the message box is non-empty
    if (player1 && player2) {
      // Grab the message from the input box and subsequently reset the input box
      var chatter;
      turn === 1
        ? (chatter = $('#player1_name').text())
        : $('#player2_name').text();
      console.log(turn);
      console.log(chatter);
      var msg = chatter + ': ' + $('#chatText').val();
      $('#chatText').val('');

      // Get a key for the new chat entry
      var chatKey = database
        .ref()
        .child('/chat/')
        .push().key;

      // Save the new chat entry
      database.ref('/chat/' + chatKey).set(msg);
    }
  });

  database.ref('/chat/').on('child_added', function(snapshot) {
    var chatMsg = snapshot.val();
    var chatEntry = $('<div>').html(chatMsg);

    $('#chat').append(chatEntry);
    // $("#chat").scrollTop($("#chatDisplay")[0].scrollHeight);
  });
});