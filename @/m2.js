/// <reference path="./ui.js"/>
const decoder = new TextDecoder();
(function() {
  function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }
  let exp = window._export || _export;
  const Component = exp.default;
  const { render, h, Fragment } = exp._;
  const main = document.getElementById("root");
  // const defer = Promise.prototype.then.bind(Promise.resolve());
  const safeParse = j => JSON.parse(j || "[]");

  const get = s => localStorage.getItem(s);

  const set = (s, v) => localStorage.setItem(s, v) || v;
  const html = self.htm.bind(h);

  async function getFile(b) {
    const c = ab2str(b);
    return c;
  }
  class ReqForPass extends Component {
    constructor(p) {
      super(p);
      this.state = { pVal: "" };
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    async handleSubmit() {
      const val = this.state.pVal;
      const decr = self.dec(val);
      const newKey = decr(saveKeyEnc);
      try {
        const file = await getFile(
          await self.decrypt(self.encData, self.iv, newKey)
        );
        this.props.updater(JSON.parse(file));
      } catch (e) {
        this.setState({ hasError: true });
      }
    }
    render() {
      if (!this.state.hasError) {
        return h(
          Fragment,
          null,
          html`
            <div class="fullPage">
              <div class="bold" style="font-size:60px">
                You have not unlocked Round 2 Yet
              </div>
              <div style="font-size:30px">
                Enter the Password given to you by the Volunteers
              </div>
              <div>
                <form action="javascript:" onsubmit=${this.handleSubmit}>
                  <input
                    type="password"
                    onInput=${e => this.setState({ pVal: e.target.value })}
                    style="width:80% ;padding:10px;text-align:center"
                  />
                  <button
                    class="Start"
                    style="width: 20%;display: block;margin: auto;margin-top:5px"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          `
        );
      }
      return html`
        <div class="rf">Wrong Password</div>
        <div
          class="Start"
          style="width: 20%;display: block;margin: auto;margin-top:5px"
          onClick=${() => location.reload()}
        >
          Click Here To Reload
        </div>
      `;
    }
  }

  class App extends Component {
    constructor() {
      super();
      this.state = {
        isUnlocked: false,
        showInfo: false,
        _time: get("stored-date") || set("stored-date", Date.now())
      };
      this._update = d =>
        this.setState({
          data: d,
          isUnlocked: true
        });
      this._toggleInfo = () =>
        this.setState(ps => ({
          showInfo: !ps.showInfo,
          showLeft: false
        }));
    }
    render() {
      return html`
        <${Fragment}>
        <header flex>
            <div class="opt hoverable">Number of questions: 5</div>
            <div class="opt hoverable" onclick=${this._toggleInfo}> Info</div>
        </header>
          <div class="contain-app" style="margin-right:auto;margin-left:auto;text-align:center">${
            !this.state.isUnlocked
              ? html`
                  <${ReqForPass} updater=${this._update} />
                `
              : html`
                  <${Round2} data=${this.state.data} />
                `
          }
          </div>
          ${this.state.showInfo &&
            html`
              <${Info} toggle=${this._toggleInfo} _time=${this.state._time} />
            `}
        </${Fragment}>
      `;
    }
  }
  class Round2 extends Component {
    constructor(a) {
      super(a);
      this.state = { currentQuestion: 1, qstring: a.data.question };
      this._increment = v =>
        this.setState(p => ({
          currentQuestion: p.currentQuestion + 1,
          qstring: v
        }));
    }
    render(props) {
      const data = props.data;
      const qs = this.state.currentQuestion;
      if (qs > 5) {
        return html`
          <div class="rf">
            Congratulations on completing the competition! Please ask one of the
            volunteers to assess your code.
          </div>
        `;
      } else {
        const hint = data.hints["q" + qs];
        const ans = data.answers["s" + qs];
        return html`
        <${Question} incr=${this._increment} q=${this.state.qstring} hint=${hint} ans=${ans} qs=${qs}></${Question}>
      `;
      }
    }
  }
  class Question extends Component {
    constructor(pr) {
      super(pr);
      this.state = { val: "" };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
      this.setState({ val: e.target.value });
    }
    handleSubmit() {
      if (this.state.val === this.props.ans) {
        this.setState({ hasError: false, val: "" });
        this.props.incr(this.props.ans);
      } else {
        this.setState({ hasError: true });
      }
    }
    render(props) {
      const dataIn = [];
      const dataOut = [];
      props.hint.map(k => {
        console.log(k);
        dataOut.push(k.out);
        dataIn.push(k.in);
      });
      return html`
        <div style="font-size:25px;">Current Question : ${props.qs}</div>
        <div style="font-size:20px;margin-top:10px">
          Formulate an algorithm, for which when you enter the following strings
          through it, it produces the following outputs:
        </div>
        <div class="hints">
          <div class="row-data">
            ${dataIn.map(
              x =>
                html`
                  <div class="in">${x}</div>
                `
            )}
          </div>
          <img
            class="arr"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDBWMHoiLz48cGF0aCBkPSJNMTYuMDEgMTFINHYyaDEyLjAxdjNMMjAgMTJsLTMuOTktNHYzeiIvPjwvc3ZnPg=="
          />
          <div class="row-data">
            ${dataOut.map(
              x =>
                html`
                  <div class="out">${x}</div>
                `
            )}
          </div>
        </div>
        <div class="q__string">
          Your Question is :
          <span style="font-weight:bold;font-size:20px">${props.q}</span>
        </div>
        <form action="javascript:" onsubmit=${this.handleSubmit}>
          <input
            value=${this.state.val}
            onchange=${this.handleChange}
            placeholder="Enter Output Here"
            style="padding:10px;border-radius:4px;border:2px solid;width:30%"
          /><button
            class="Start"
            style="width: 20%;display: block;margin: auto;margin-top:5px"
          >
            Submit
          </button>
        </form>

        ${this.state.hasError &&
          html`
            <div style="color:red;font-size:18px;">Incorrect Answer</div>
          `}
        <div class="info_">
          <div>
            This round consists of a string passed through 5 ciphers. Your task
            is to formulate algorithms and to reach the final string.
          </div>
          <div>
            You will be provided with example strings and their outputs when
            passed through the algorithm, you will be required to draw out the
            relation from them.
          </div>
          <div>
            You can request for an additional hint at the cost of 3 points per
            hint.
          </div>
          <div>
            As important it is to get the final string, it is also required that
            your code produces identical outputs for the inputs provided to you
            in the examples.
          </div>
          <div>
            As a simple clue, you can expect to fiddle around with ascii codes
            to reach the answer.
          </div>
        </div>
      `;
    }
  }
  render(h(App), main);
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
        " Seconds left"
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
          class: "infoBox",
          style: "height:15%"
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
        )
      )
    );
  }
})();
