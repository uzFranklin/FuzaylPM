(function () {
  var EXAM_DATE = new Date(2027, 6, 15);
  var currentMode = "topic";
  var uploadedExamples = [];

  function pad(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function formatDate(date) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function updateCountdown() {
    var today = new Date();
    var current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var diff = EXAM_DATE.getTime() - current.getTime();
    var days = Math.max(0, Math.ceil(diff / 86400000));
    document.getElementById("countdown-days").innerHTML = String(days);
    document.getElementById("countdown-note").innerHTML = formatDate(today) + " sanadan hisoblanganda " + days + " kun qoldi.";
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function topicType(topic) {
    var value = String(topic || "").toLowerCase();
    if (value.indexOf("kasr") >= 0 || value.indexOf("ulush") >= 0) return "fraction";
    if (value.indexOf("foiz") >= 0 || value.indexOf("percent") >= 0) return "percent";
    if (value.indexOf("geometr") >= 0 || value.indexOf("yuza") >= 0 || value.indexOf("perimetr") >= 0) return "geometry";
    if (value.indexOf("tezlik") >= 0 || value.indexOf("vaqt") >= 0 || value.indexOf("masofa") >= 0) return "speed";
    if (value.indexOf("tenglama") >= 0 || value.indexOf("amal") >= 0) return "equation";
    return "mixed";
  }

  function parseTopics(topicText) {
    var raw = String(topicText || "").split(",");
    var result = [];
    var i;
    for (i = 0; i < raw.length; i += 1) {
      var cleaned = raw[i].replace(/^\s+|\s+$/g, "");
      if (cleaned) result.push(cleaned);
    }
    if (!result.length) result.push("Aralash");
    return result;
  }

  function buildQuestion(kind, day, number) {
    var options;
    var answer;
    var text;
    var base;

    if (kind === "fraction") {
      var denominator = 2 + ((day + number) % 4);
      var numerator = denominator === 2 ? 1 : denominator - 2;
      var total = denominator * (6 + day + number);
      answer = (total / denominator) * numerator;
      text = total + " ta mevaning " + numerator + "/" + denominator + " qismi nechta?";
      options = [answer - 2, answer, answer + 2, total / denominator, answer + denominator];
    } else if (kind === "percent") {
      base = (10 + day + number) * 100;
      var percentList = [10, 20, 25, 30, 50];
      var percent = percentList[(day + number) % percentList.length];
      answer = (base * percent) / 100;
      text = base + " so'mning " + percent + "% qismi nechaga teng?";
      options = [answer - 100, answer, answer + 100, base / 10, answer + percent];
    } else if (kind === "geometry") {
      if (number % 2 === 0) {
        var side = 4 + day + number;
        answer = side * 4;
        text = "Kvadratning bir tomoni " + side + " sm. Uning perimetrini toping.";
        options = [side * 2, side * 3, answer, answer + side, side * side];
      } else {
        var width = 5 + day;
        var height = 3 + (number % 5);
        answer = width * height;
        text = "Tomonlari " + width + " sm va " + height + " sm bo'lgan to'g'ri to'rtburchakning yuzasini toping.";
        options = [width + height, (width + height) * 2, answer, answer + width, answer - height];
      }
    } else if (kind === "speed") {
      var speed = 3 + (number % 4);
      var time = 30 + day * 10 + number * 5;
      answer = speed * time;
      text = "O'quvchi sekundiga " + speed + " metr tezlik bilan " + time + " sekund yurdi. Necha metr masofa bosib o'tdi?";
      options = [answer - 20, answer, answer + 20, speed + time, time - speed];
    } else if (kind === "equation") {
      var p = 10 + day + number;
      var add = 4 + (number % 5);
      var mult = 3 + (day % 4);
      var result = (p - add) * mult;
      answer = p;
      text = "(p - " + add + ") x " + mult + " = " + result + ". p ni toping.";
      options = [p - add, p, p + add, result / mult, p + mult];
    } else {
      if (number % 5 === 0) {
        base = 120 + day * 10 + number * 3;
        var b = 20 + number;
        answer = base + b;
        text = base + " bilan " + b + " ning yig'indisini toping.";
        options = [answer - 10, answer - 5, answer, answer + 5, answer + 10];
      } else if (number % 5 === 1) {
        var start = 10 + day + number;
        var step = 3 + (number % 3);
        answer = start + step * 3;
        text = "Ketma-ketlikdagi tushirib qoldirilgan sonni toping: " + start + "; " + (start + step) + "; " + (start + step * 2) + "; ...; " + (start + step * 4) + "; " + (start + step * 5) + ".";
        options = [answer - step, answer, answer + step, answer + 2, start];
      } else if (number % 5 === 2) {
        var workers = (4 + day + (number % 4)) * 25;
        var ratio = 2 + ((day + number) % 3);
        answer = (workers / 25) * ratio;
        text = "Har 25 ta ishchiga " + ratio + " tadan nazoratchi to'g'ri keladi. " + workers + " ta ishchi uchun nechta nazoratchi kerak?";
        options = [workers / 25, answer - ratio, answer, answer + ratio, workers / 5];
      } else if (number % 5 === 3) {
        var first = 4 + (number % 5);
        var remaining = 5 + day + (number % 4);
        answer = first + remaining * 2;
        text = "Bola " + first + " ta qulupnay yedi. So'ng qolganining yarmini yedi va oxirida " + remaining + " ta qulupnay qoldi. Avval nechta qulupnay bor edi?";
        options = [remaining * 2, answer - 1, answer, answer + 1, answer + remaining];
      } else {
        var totalBooks = (8 + day + number) * 24 + 3;
        answer = Math.floor(totalBooks / 24) + 1;
        text = totalBooks + " ta daftarni har biriga 24 tadan sig'adigan qutilarga joylash kerak. Eng kamida nechta quti kerak?";
        options = [answer - 1, answer, answer + 1, answer + 2, 24];
      }
    }

    return {
      text: text,
      answer: answer,
      options: options
    };
  }

  function buildExamQuestion(day, number) {
    var answer;
    var text;
    var mode = number % 12;

    if (mode === 0) {
      var x1 = 10;
      var y1 = 2 + day;
      var x2 = 10;
      var y2 = y1 + 2 + (number % 4);
      answer = Math.abs(y2 - y1);
      text = "Koordinatalari (" + x1 + "; " + y1 + ") va (" + x2 + "; " + y2 + ") bo'lgan nuqtalarni tutashtiruvchi kesmaning uzunligini toping.";
    } else if (mode === 1) {
      var big = 9999 - day * 3;
      var small = 10 + number;
      answer = big - small;
      text = "Eng katta to'rt xonali songa yaqin " + big + " sonidan " + small + " ni ayiring.";
    } else if (mode === 2) {
      var startHour = 18 + (day % 3);
      var startMinute = 10 + (number % 4) * 5;
      var endHour = 7 + (day % 4);
      var endMinute = 5 + (number % 5) * 5;
      var start = startHour * 60 + startMinute;
      var end = 24 * 60 + endHour * 60 + endMinute;
      var diff = end - start;
      answer = Math.floor(diff / 60) + " soat " + (diff % 60) + " daqiqa";
      text = "Hozir soat " + pad(startHour) + ":" + pad(startMinute) + ". Ertaga " + pad(endHour) + ":" + pad(endMinute) + " da tadbir boshlanadi. Qancha vaqt qoldi?";
    } else if (mode === 3) {
      var seqStart = 15 + day + number;
      var seqStep = 4 + (number % 4);
      answer = seqStart + seqStep * 3;
      text = "Ketma-ketlikdagi tushirib qoldirilgan sonni toping: " + seqStart + "; " + (seqStart + seqStep) + "; " + (seqStart + seqStep * 2) + "; ...; " + (seqStart + seqStep * 4) + "; " + (seqStart + seqStep * 5) + ".";
    } else if (mode === 4) {
      var flour = 7 + day;
      var grams = flour * 1000;
      var cake = 350 + (number % 3) * 50;
      var used = Math.floor(grams / cake) * cake;
      answer = grams - used;
      text = flour + " kilogramm undan har biri uchun " + cake + " gramm kerak bo'lgan tortlar tayyorlandi. Qancha un qoladi?";
    } else if (mode === 5) {
      var notebooks = (12 + day + number) * 48;
      answer = notebooks / 48;
      text = notebooks + " ta daftarni har bir qutiga 48 tadan joylash kerak. Nechta quti kerak?";
    } else if (mode === 6) {
      var workers = (6 + day) * 25;
      answer = (workers / 25) * 2;
      text = "Har 25 ta ishlab chiqaruvchi ishchiga 2 tadan nazoratchi to'g'ri keladi. " + workers + " ta ishchi uchun nechta nazoratchi kerak?";
    } else if (mode === 7) {
      var sisters = 24 + day;
      answer = sisters + 18;
      text = "Uchta opa-singil yoshlarining yig'indisi " + sisters + " ga teng. 6 yildan keyin ularning yoshlarining yig'indisi nechaga teng bo'ladi?";
    } else if (mode === 8) {
      var speed1 = 4 + (day % 2);
      var time1 = 60 + number * 2;
      var speed2 = speed1 + 1;
      var time2 = 80 + day * 3;
      answer = speed1 * time1 + speed2 * time2;
      text = "O'quvchi avval sekundiga " + speed1 + " metr tezlikda " + time1 + " sekund, keyin sekundiga " + speed2 + " metr tezlikda " + time2 + " sekund harakatlandi. Jami masofani toping.";
    } else if (mode === 9) {
      var side = 30 + day + number;
      answer = side * 3 / 4;
      if (side * 3 % 4 !== 0) {
        side += 1;
        answer = side * 3 / 4;
      }
      text = "Teng tomonli uchburchakning bir tomoni " + side + " sm. Uning perimetri kvadrat perimetriga teng bo'lsa, kvadratning bir tomoni nechaga teng?";
    } else if (mode === 10) {
      var total = 30 + day * 2;
      var diffPair = 8 + (number % 3) * 2;
      var a = (total + diffPair) / 2;
      var b = total - a;
      answer = a * b;
      text = "Ikkita sonning yig'indisi " + total + " ga, ayirmasi " + diffPair + " ga teng. Shu sonlarning ko'paytmasini toping.";
    } else {
      var endNumber = 114 + day;
      var digitsUsed = 57 + (number % 3);
      var first = endNumber - (digitsUsed - 3);
      answer = first;
      text = "Butun sonlar ketma-ket yozilgan. Oxirgi son " + endNumber + ". Jami " + digitsUsed + " ta raqam yozilgan bo'lsa, birinchi sonni toping.";
    }

    return {
      text: text,
      answer: answer,
      options: [answer]
    };
  }

  function inferExampleKinds(topicList, notes, files) {
    var text = (topicList.join(" ") + " " + notes + " " + files.join(" ")).toLowerCase();
    var kinds = [];
    if (text.indexOf("kasr") >= 0 || text.indexOf("ulush") >= 0) kinds.push("fraction");
    if (text.indexOf("foiz") >= 0) kinds.push("percent");
    if (text.indexOf("geometr") >= 0 || text.indexOf("yuza") >= 0 || text.indexOf("perimetr") >= 0) kinds.push("geometry");
    if (text.indexOf("tezlik") >= 0 || text.indexOf("vaqt") >= 0 || text.indexOf("masofa") >= 0) kinds.push("speed");
    if (text.indexOf("tenglama") >= 0 || text.indexOf("amal") >= 0) kinds.push("equation");
    if (text.indexOf("diagramma") >= 0 || text.indexOf("mantiq") >= 0 || text.indexOf("ketma") >= 0) kinds.push("mixed");
    if (!kinds.length) kinds = ["mixed", "fraction", "geometry"];
    return kinds;
  }

  function buildExampleQuestion(kinds, day, number) {
    var kind = kinds[(day + number - 2) % kinds.length];
    var question = buildQuestion(kind, day + 1, number + 2);
    var prefix = [
      "Namunaga o'xshash masala:",
      "Quyidagi misolga o'xshash savol:",
      "Berilgan namunaga yaqin topshiriq:",
      "Rasm namunasi asosida savol:"
    ][(day + number) % 4];
    question.text = prefix + " " + question.text;
    return question;
  }

  function normalizeOptions(values) {
    var out = [];
    var i;
    for (i = 0; i < values.length; i += 1) {
      var value = String(values[i]);
      if (out.indexOf(value) < 0) out.push(value);
    }
    while (out.length < 5) {
      out.push(String(Number(out[out.length - 1]) + 1));
    }
    return out.slice(0, 5);
  }

  function optionLetter(index) {
    return ["A", "B", "C", "D", "E"][index];
  }

  function buildWeek(topicList, student, title) {
    var html = "";
    var day;
    var questionIndex;
    var answerHtml = "";
    var summary = topicList.join(", ");
    var exampleNotes = "";
    var exampleKinds = [];
    var fileNames = [];

    if (currentMode === "example") {
      exampleNotes = document.getElementById("example-notes").value || "";
      fileNames = uploadedExamples.map(function (item) { return item.name; });
      exampleKinds = inferExampleKinds(topicList, exampleNotes, fileNames);
    }

    for (day = 1; day <= 7; day += 1) {
      html += '<section class="sheet">';
      html += '<header class="sheet-header"><div>';
      html += '<p class="sheet-kicker">' + day + '-kun</p>';
      html += '<h3>' + escapeHtml(summary) + ' bo\'yicha mashqlar</h3>';
      html += '<p class="sheet-meta">' + escapeHtml(title) + (student ? ' | O\'quvchi: ' + escapeHtml(student) : '') + ' | 15 ta savol</p>';
      html += '</div><div class="sheet-side"><span class="sheet-badge">15 ta savol</span><span class="sheet-badge light">5 variantli test</span></div></header>';
      html += '<ol class="question-list">';

      answerHtml += '<article class="answer-card"><h3>' + day + '-kun javoblari</h3><div class="answer-list">';

      for (questionIndex = 1; questionIndex <= 15; questionIndex += 1) {
        var question;
        if (currentMode === "exam") {
          question = buildExamQuestion(day, questionIndex);
        } else if (currentMode === "example") {
          question = buildExampleQuestion(exampleKinds, day, questionIndex);
        } else {
          var currentTopic = topicList[(day + questionIndex - 2) % topicList.length];
          var kind = topicType(currentTopic);
          question = buildQuestion(kind, day, questionIndex);
        }
        var opts = normalizeOptions(question.options);
        var i;

        for (i = 0; i < opts.length; i += 1) {
          if (String(question.answer) === opts[i]) break;
        }

        html += '<li><div class="question-text">' + escapeHtml(question.text) + '</div><div class="solution-space"></div></li>';
        answerHtml += '<div class="answer-item">' + questionIndex + '. ' + escapeHtml(String(question.answer)) + '</div>';
      }

      answerHtml += '</div></article>';
      html += '</ol></section>';
    }

    html += '<section class="panel answers-panel"><div class="panel-header"><div><p class="section-kicker">Javoblar</p><h2>Haftalik javoblar kaliti</h2></div></div><div class="answers-grid">' + answerHtml + '</div></section>';
    return html;
  }

  function generate(event) {
    if (event && event.preventDefault) event.preventDefault();
    var topic = document.getElementById("topic-input").value || "Aralash";
    var student = document.getElementById("student-input").value || "";
    var title = document.getElementById("title-input").value || "Haftalik mashqlar";
    var topicList = parseTopics(topic);
    var topicSummary = topicList.join(", ");
    document.getElementById("summary-title").innerHTML = escapeHtml(title);
    document.getElementById("summary-mode").innerHTML =
      currentMode === "exam" ? "Bo'lim: 2" :
      currentMode === "example" ? "Bo'lim: 3" : "Bo'lim: 1";
    document.getElementById("summary-topic").innerHTML = "Mavzu: " + escapeHtml(topicSummary);
    document.getElementById("status-text").innerHTML = currentMode === "exam"
      ? "2-bo'lim uchun topshiriqlar tayyorlandi. Bu rejim pm_1_22 namunasi uslubiga yaqinlashtirildi."
      : currentMode === "example"
        ? "3-bo'lim uchun topshiriqlar tayyorlandi. Rasm va izoh asosida o'xshash savollar yaratildi."
        : "1-bo'lim uchun topshiriqlar tayyorlandi.";
    document.getElementById("result-content").innerHTML = buildWeek(topicList, student, title);
    return false;
  }

  function renderExamplePreview() {
    var preview = document.getElementById("example-preview");
    if (!preview) return;
    if (!uploadedExamples.length) {
      preview.innerHTML = '<p class="hero-text">Rasm yuklanganda shu yerda ko\'rinadi.</p>';
      return;
    }

    preview.innerHTML = "";
    uploadedExamples.forEach(function (file) {
      var card = document.createElement("div");
      card.className = "preview-card";
      var image = document.createElement("img");
      image.src = file.url;
      image.alt = file.name;
      var name = document.createElement("div");
      name.className = "preview-name";
      name.textContent = file.name;
      card.appendChild(image);
      card.appendChild(name);
      preview.appendChild(card);
    });
  }

  function bindExampleUpload() {
    var input = document.getElementById("example-images");
    if (!input) return;
    input.onchange = function () {
      var files = Array.prototype.slice.call(input.files || []);
      uploadedExamples = files.map(function (file) {
        return {
          name: file.name,
          url: URL.createObjectURL(file)
        };
      });
      renderExamplePreview();
    };
  }

  function bindModeButtons() {
    var buttons = document.getElementById("mode-switch").getElementsByTagName("button");
    var i;
    for (i = 0; i < buttons.length; i += 1) {
      buttons[i].onclick = function () {
        var mode = this.getAttribute("data-mode");
        var all = document.getElementById("mode-switch").getElementsByTagName("button");
        var j;
        currentMode = mode;
        for (j = 0; j < all.length; j += 1) {
          all[j].className = "mode-button";
        }
        this.className = "mode-button active";
        document.getElementById("example-panel").hidden = currentMode !== "example";
      };
    }
  }

  document.getElementById("generator-form").onsubmit = generate;
  document.getElementById("print-button").onclick = function () {
    window.print();
  };
  document.getElementById("pdf-button").onclick = function () {
    document.getElementById("status-text").innerHTML = "PDF oynasi ochilmoqda. Printer sifatida Save as PDF ni tanlang.";
    window.print();
  };

  updateCountdown();
  bindModeButtons();
  bindExampleUpload();
})();
