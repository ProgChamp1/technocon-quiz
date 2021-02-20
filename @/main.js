/// <reference path="./ui.js"/>

/**@jsx h */
// No modules under file:// urls..ok
(function() {
  const safeParse = j => JSON.parse(j || "[]");

  const get = s => localStorage.getItem(s);

  const set = (s, v) => void defer(() => localStorage.setItem(s, v)) || v;

  const defer = Promise.prototype.then.bind(Promise.resolve());
  /**@type {_export} */
  let exp = window._export || _export;
  const Component = exp.default;
  const { render, h, Fragment } = exp._;
  const main = document.getElementById("root");
  class Question extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isSolved: !!props.isMarked
      };
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
      this.props.deduct(this.state.isSolved ? -1 : 1);
      let mq = safeParse(get("marked-questions"));
      const i = this.props.i;
      !this.state.isSolved ? mq.push(i) : (mq = mq.filter(v => v !== i));
      set("marked-questions", JSON.stringify(mq));
      this.setState(ps => ({
        isSolved: !ps.isSolved
      }));
    }

    render(props, state) {
      const v = props.v;
      const i = props.i; //destructure support?

      const solved = state.isSolved ? "solved" : "unsolved";
      const q = v.question;
      const hint = v.hint;
      const qv = typeof q === "function" ? h(q) : q;
      return h(
        "div",
        {
          class: "question"
        },
        h(
          "div",
          {
            flex: "",
            onClick: this.handleClick,
            style: "cursor: pointer;"
          },
          h(
            "span",
            {
              style: { fontWeight: "bold" }
            },
            "Question: ",
            i + 1
          ),
          h("span", {
            class: [solved, "q-state"]
          })
        ),
        h("div", null, qv),
        hint &&
          h(Hint, {
            h: hint,
            q: q,
            i: i
          })
      );
    }
  }

  class Hint extends Component {
    constructor(p) {
      super(p);
      this.state = {
        showHint: false
      };

      this._toggle = () =>
        this.setState(ps => ({
          showHint: !ps.showHint
        }));
    }

    render(props) {
      return [
        h(
          "div",
          {
            flex: "",
            class: "infbtn"
          },
          h(
            "span",
            {
              class: "cli",
              onclick: this._toggle
            },
            "Hint"
          )
        ),
        this.state.showHint &&
          h(
            "div",
            {
              class: "infoContainer"
            },
            h(
              "div",
              {
                class: "infoBox"
              },
              h(
                "span",
                {
                  class: "close"
                },
                h("img", {
                  onClick: this._toggle,
                  class: "close_img",
                  src: "./@/close.svg"
                })
              ),
              h(
                "div",
                null,
                "Hint for Question:",
                " ",
                h(
                  "span",
                  {
                    style: { fontWeight: "bold" }
                  },
                  props.i + 1
                )
              ),
              h(
                "div",
                {
                  style: { textAlign: "left", padding: "4px" }
                },
                h(
                  "div",
                  {
                    style: { fontWeight: "bold" }
                  },
                  props.q
                ),
                h("div", null, props.h)
              )
            )
          )
      ];
    }
  }

  function Round1(props) {
    /**
     * @type {Array}
     */
    const questions = self.questions(h, Fragment);
    return questions.map((v, i) =>
      h(Question, {
        isMarked: props.markedQuestions.includes(i),
        v: v,
        i: i,
        deduct: props.deduct
      })
    );
  }

  class Timer extends Component {
    _update() {
      this.setState({
        time: Date.now()
      });
    }

    constructor(a) {
      super(a);
    }

    componentDidMount() {
      this._timer = setInterval(this._update.bind(this), 1000);
    }

    render() {
      return;
    }

    componentWillUnmount() {
      clearInterval(this._timer);
    }

    render(_, s) {
      const a = 7200 - ((s.time || Date.now()) - _.time) / 1000;
      const minutesLeft = Math.floor(a / 60);
      const secondsLeft = (a % 60).toFixed();
      if (secondsLeft <= 0) {
        if (minutesLeft <= 0) return "Time Up";
        if (minutesLeft <= 60) return "Round 2 unlocked";
      }
      return h(Fragment, null, [
        minutesLeft,
        " Minutes ",
        secondsLeft,
        " Seconds"
      ]);
    }
  }

  function Info(props) {
    const fn = props.toggle;
    return h(
      "div",
      {
        class: "infoContainer"
      },
      h(
        "div",
        {
          class: "infoBox"
        },
        h(
          "span",
          {
            class: "close"
          },
          h("img", {
            onClick: fn,
            class: "close_img",
            src: "./@/close.svg"
          })
        ),
        h(
          "div",
          null,
          "  ",
          h(Timer, {
            time: props._time
          }),
          " "
        ),
        h("div", null, "Questions Marked as Solved: ", props.questionsSolved),
        h("div", null, "Current Round : Round 1")
      )
    );
  }

  function QuestionsLeft(props) {
    const fn = props.toggle;
    const ql = props.questionsLeft;
    return h(
      "div",
      {
        class: "infoContainer"
      },
      h(
        "div",
        {
          class: "infoBox",
          style: { height: "20%" }
        },
        h(
          "span",
          {
            class: "close"
          },
          h("img", {
            onClick: fn,
            class: "close_img",
            src: "./@/close.svg"
          })
        ),
        h(
          "div",
          null,
          ql.length
            ? [
                "Question Numbers left:",
                h("div", null, ql.map(x => x + 1).join(" "))
              ]
            : "All Questions Marked as solved"
        )
      )
    );
  }

  class Main extends Component {
    constructor(props) {
      super(props);
      const qs = get("questionsSolved") || 10;
      this.state = {
        questionsLeft: qs,
        showInfo: false,
        showLeft: false,
        questionsSolved: 10 - qs,
        _time: get("stored-date") || set("stored-date", Date.now()),
        markedQuestions: safeParse(get("marked-questions"))
      };

      this._deduct = m =>
        this.setState(ps => ({
          questionsLeft: set("questionsSolved", ps.questionsLeft - (m || 1)),
          questionsSolved: ps.questionsSolved + (m || 1)
        }));

      this._toggleInfo = () =>
        this.setState(ps => ({
          showInfo: !ps.showInfo,
          showLeft: false
        }));

      this._toggleLeft = () =>
        this.setState(ps => ({
          showInfo: false,
          showLeft: !ps.showLeft
        }));
    }

    render() {
      return h(
        Fragment,
        null,
        h(
          "header",
          {
            flex: ""
          },
          h(
            "div",
            {
              class: "opt hoverable"
            },
            "Number of questions: 10"
          ),
          h(
            "div",
            {
              class: "opt hoverable",
              onclick: this._toggleLeft
            },
            "Questions left:",
            this.state.questionsLeft
          ),
          h(
            "div",
            {
              class: "opt hoverable",
              onClick: this._toggleInfo
            },
            "Info"
          ),
          h(
            "a",
            {
              href: "./round2.html",
              class: "opt hoverable"
            },
            "Round 2"
          )
        ),
        h(
          "div",
          {
            class: "contain-app"
          },
          h(Round1, {
            markedQuestions: this.state.markedQuestions,
            deduct: this._deduct
          }),
          this.state.showInfo &&
            h(Info, {
              toggle: this._toggleInfo,
              _time: this.state._time,
              questionsSolved: this.state.questionsSolved
            }),
          this.state.showLeft &&
            h(QuestionsLeft, {
              toggle: this._toggleLeft,
              questionsLeft: Array.from({
                length: 10
              })
                .map((_, v) => v)
                .filter(x => !safeParse(get("marked-questions")).includes(x))
            })
        )
      );
    }
  }

  class App extends Component {
    constructor() {
      super();
      this.state = {
        start: get("clicked") === "true"
      };
      this._startComponent = h(
        "div",
        {
          class: "fullPage"
        },
        h(
          "div",
          {
            style: {
              fontSize: "60px",
              margin: "25px"
            }
          },
          "BrainStorm Round 1"
        ),
        h(
          "button",
          {
            class: "Start",
            onclick: () => {
              set("clicked", true);
              this.setState({
                start: true
              });
            }
          },
          "Start"
        )
      );
    }

    render() {
      return this.state.start ? h(Main) : this._startComponent;
    }
  }

  render(h(App), main);
})();
