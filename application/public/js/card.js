document.addEventListener("DOMContentLoaded", async function () {
  await load();
});

//global constants
var index = 0;

const load = async () => {
  //GENERATE MIDDLE DISPLAY FOR CARD
  const middleDisplay = document.querySelector("#middleDisplay");
  middleDisplay.innerHTML = `<div class="col-10 offset-1">
      <div class="card border-dark shadow-lg  overflow-scroll studyCard" style="width: 100%;height:70vh">
        <div class="card-body m-3">
          <h5 class="card-title text-center pb-2" id="question"></h5>
          <p class="card-text text-center" id="answer"></p>
        </div>
      </div>
    </div>`;
};

const noCard = () => {
  const question = document.querySelector("#question");
  question.innerHTML = "You have no cards to do today!";
  const answer = document.querySelector("#answer");
  answer.innerHTML = "";
  const dueAndNew = document.querySelector("#dueAndNew");
  dueAndNew.innerHTML = "";

  //CLEAR BOTTOM DISPLAY
  const bottomDisplay = document.querySelector("#bottomDisplay");
  bottomDisplay.innerHTML = ``;
  //console.log("no card");
  return;
};

const generateCard = async () => {
  var card = responseData[index];
  if (card === undefined) {
    return load();
  }
  if (card.type === 1 || card.type === 2) {
    dueCardCount -= 1;
  } else if (card.type === 3) {
    newCardCount -= 1;
  }
  //INPUT QUESTION AND ANSWER FOR CARDS
  const cardsNew = document.querySelector("#cardsNew");
  cardsNew.innerHTML = `${newCardCount}`;
  const cardsDue = document.querySelector("#cardsDue");
  cardsDue.innerHTML = `${dueCardCount}`;
  const question = document.querySelector("#question");
  question.innerHTML = `${card.question}`;
  const answer = document.querySelector("#answer");
  answer.style.color = "white";
  answer.innerHTML = `${card.answer}<br/><br/><br/>`;

  //GENERATE BOTTOM DISPLAY FOR BUTTONS
  const bottomDisplay = document.querySelector("#bottomDisplay");
  bottomDisplay.innerHTML = `<div class="card bg-dark" style="width: 100%; height: 10%">
    <div class="card-body">
      <div class="row" id="footer">
        <div class="col-10 offset-1">
          <div class="d-grid">
            <button class="btn btn-dark p-2 sign-up-btn roboto" type="button" onclick="showAnswer()">
              SHOW ANSWER
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
};

const showAnswer = () => {
  var card = responseData[index];
  var { type, step, interval, ease } = card;
  if (type == 3) {
    var again = 0;
    var hard = 0;
    var good = 1;
    var easy = 8;
  } else if (type == 1) {
    const intervals = [0, 1, 3, 7];
    var again = 0;
    var hard = interval;
    var good = intervals[step + 1];
    var easy = 8;
  } else if (type == 2) {
    var again = 0;
    var hard = Math.floor(interval * ease * 0.85);
    var good = Math.floor(interval * ease);
    var easy = Math.floor(interval * ease * 1.15);
  }
  //REVEAL ANSWER
  const answer = document.querySelector("#answer");
  answer.style.color = "black";

  //CHANGE FOOTER TO ALLOW USER TO RESPOND TO CARD
  const footer = document.querySelector("#footer");
  footer.innerHTML = `<div class="col-6 col-md-3">
          <div class="d-grid">
            <button
              class="btn btn-dark sign-up-btn roboto"
              type="button"
              onclick="masterHandler(1)"
            >
              <span class="p-3">AGAIN (${again}d)</span>
            </button>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="d-grid">
            <button
              class="btn btn-dark sign-up-btn roboto"
              type="button"
              onclick="masterHandler(2)"
            >
              <span class="p-3">HARD (${hard}d)</span>
            </button>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="d-grid">
            <button
              class="btn btn-dark sign-up-btn roboto"
              type="button"
              onclick="masterHandler(3)"
            >
              <span class="p-3">GOOD (${good}d)</span>
            </button>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="d-grid">
            <button
              class="btn btn-dark sign-up-btn roboto"
              type="button"
              onclick="masterHandler(4)"
            >
              <span class="p-3">EASY (${easy}d)</span>
            </button>
          </div>
        </div>`;
};

const masterHandler = async (difficulty) => {
  var card = responseData[index];
  var { type, _id: id } = card;
  //INITIALIZE CARD FROM NEW TO LEARNING
  if (type === 3) {
    type = 1;
    const updating = await axios.put(`/api/initialization/${id}`, {
      type: type,
    });
    //console.log(updating.data);
  }
  if (type === 1) {
    await learningHandler(difficulty);
  } else if (type === 2) {
    await graduatedHandler(difficulty);
  }
};

const learningHandler = async (difficulty) => {
  var card = responseData[index];
  var { _id: id, type, step, interval, dueDate, user: userID } = card;

  if (difficulty === 1) {
    //RESET LEARNING CARD TO FIRST STEP
    const updating = await axios.put(`/api/learning/${id}`, {
      step: 0,
      interval: 0,
      dueDate: dateFunction.currentDate(),
    });
    //console.log(updating.data);
  } else if (difficulty === 2) {
    //LEARNING CARD STEP STAYS THE SAME
    dueDate = dateFunction.addDaysToDate(interval, dateFunction.currentDate());

    const updating = await axios.put(`/api/learning/${id}`, {
      dueDate: dueDate,
    });
    //console.log(updating.data);
    updateReviewCount();
  } else if (difficulty === 3) {
    //CARD BECOMES GRADUATED, INTERVAL SHOULD GO FROM 3 TO 7, TYPE SHOULD CHANGE
    const intervals = [0, 1, 3, 7];
    if (step === 2) {
      step += 1;
      type += 1;
      interval = intervals[step];
      dueDate = dateFunction.addDaysToDate(
        interval,
        dateFunction.currentDate()
      );
      const updating = await axios.put(`/api/promotion/${id}`, {
        type: type,
        interval: interval,
        dueDate: dueDate,
      });
      //console.log(updating.data);
      updateReviewCount();
    } else {
      //CARD MOVES TO THE NEXT STEP, INTERVAL SHOULD CHANGE
      step += 1;
      interval = intervals[step];
      dueDate = dateFunction.addDaysToDate(
        interval,
        dateFunction.currentDate()
      );
      const updating = await axios.put(`/api/learning/${id}`, {
        step: step,
        interval: interval,
        dueDate: dueDate,
      });
      //console.log(updating.data);
      updateReviewCount();
    }
  } else if (difficulty === 4) {
    //EASY: CARD HAS GRADUATED, EASY INTERVAL SOHULD BE SEEN
    type = 2;
    interval = 8;
    dueDate = dateFunction.addDaysToDate(interval, dateFunction.currentDate());
    const updating = await axios.put(`/api/promotion/${id}`, {
      type: type,
      interval: interval,
      dueDate: dueDate,
    });
    //console.log(updating.data);
    updateReviewCount();
  }
  index += 1;
  generateCard();
};

const graduatedHandler = async (difficulty) => {
  var card = responseData[index];
  var { _id: id, type, step, interval, ease, dueDate, user: userID } = card;
  if (difficulty === 1) {
    //DEMOTION, EVERYTHING RESET, EASE CHANGE
    type = 1;
    step = 0;
    interval = 0;
    ease = ease * 0.75;
    dueDate = dateFunction.currentDate();
    const updating = await axios.put(`/api/demotion/${id}`, {
      type: type,
      step: step,
      interval: interval,
      ease: ease,
      dueDate,
    });
    //console.log(updating.data);
  } else if (difficulty === 2) {
    //HARD: EASE AND INTERVAL CHANGE
    ease = ease * 0.85;
    interval = interval * ease;
    dueDate = dateFunction.addDaysToDate(interval, dateFunction.currentDate());
    const updating = await axios.put(`/api/graduation/${id}`, {
      interval: interval,
      ease: ease,
      dueDate: dueDate,
    });
    console.log(updating.data);
    updateReviewCount();
  } else if (difficulty === 3) {
    //GOOD, EASE UNCHANGED
    ease = ease; //unchanged
    interval = interval * ease;
    dueDate = dateFunction.addDaysToDate(interval, dateFunction.currentDate());
    const updating = await axios.put(`/api/graduation/${id}`, {
      interval: interval,
      ease: ease,
      dueDate: dueDate,
    });
    //console.log(updating.data);
    updateReviewCount();
  } else if (difficulty === 4) {
    //EASY
    ease = ease * 1.15;
    interval = interval * ease;
    dueDate = dateFunction.addDaysToDate(interval, dateFunction.currentDate());
    const updating = await axios.put(`/api/graduation/${id}`, {
      interval: interval,
      ease: ease,
      dueDate: dueDate,
    });
    //console.log(updating.data);
    updateReviewCount();
  }
  index += 1;
  generateCard();
};

//date functions
class dateFunction {
  static currentDate = () => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = String(currentDate.getFullYear()).substring(2, 4);
    return `${year}${month}${day}`;
  };

  static addDaysToDate(numDays, currentDateStr) {
    // Parse the input date string into year, month, and day components
    const year = parseInt(currentDateStr.substring(0, 2)) + 2000;
    const month = parseInt(currentDateStr.substring(2, 4));
    const day = parseInt(currentDateStr.substring(4, 6));
    // Create a new Date object representing the current date
    var currentDate = new Date(year, month - 1, day);
    // Add the specified number of days to the current date
    currentDate.setDate(currentDate.getDate() + numDays);
    // Format the new date as a string in the format YYMMDD
    const newDay = String(currentDate.getDate()).padStart(2, "0");
    const newMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    const newYear = String(currentDate.getFullYear()).substring(2, 4);
    const newDateStr = `${newYear}${newMonth}${newDay}`;

    // Return the new date string
    return newDateStr;
  }
}
