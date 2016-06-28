var Holydate = function() {
    this.register = {};
    this.index = '';
};

/**
 * Hjälpfunktion för att kontrollera om ett givet värde är numeriskt.
 * 
 * @param {Number|String} num Nummer att kontrollera
 * @returns {Boolean}
 */
Holydate.prototype.isNum = function(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
};

/**
 * Översätter en datumsträng till en tidsstämpel.
 * 
 * @param {String} date Datumsträng
 * @returns {Number|Boolean}
 */
Holydate.prototype.strToTime = function(date) {
    var regex = [
        ['YMD', /^([0-9]{4})(\W?)(0[1-9]|1[0-2])(\W?)(0[1-9]|[1-2][0-9]|3[0-1])$/],
        ['YDM', /^([0-9]{4})(\W?)(0[1-9]|[1-2][0-9]|3[0-1])(\W?)(0[1-9]|1[0-2])$/],
        ['MDY', /^(0[1-9]|1[0-2])(\W?)(0[1-9]|[1-2][0-9]|3[0-1])(\W?)([0-9]{4})$/],
        ['DMY', /^(0[1-9]|[1-2][0-9]|3[0-1])(\W?)(0[1-9]|1[0-2])(\W?)([0-9]{4})$/]
    ];
    for (var i in regex) {
        var res = date.match(regex[i][1]), y, m, d;
        if (res) {
            switch (regex[i][0]) {
                case 'YMD': y = parseInt(res[1],10), m = parseInt(res[3],10), d = parseInt(res[5],10); break;
                case 'YDM': y = parseInt(res[1],10), m = parseInt(res[5],10), d = parseInt(res[3],10); break;
                case 'MDY': y = parseInt(res[5],10), m = parseInt(res[1],10), d = parseInt(res[3],10); break;
                case 'DMY': y = parseInt(res[5],10), m = parseInt(res[3],10), d = parseInt(res[1],10); break;
            }
            return new Date(y, m-1, d).getTime();
        }
    }
    return false;
};

/**
 * Sätter ett datum till typen 'date'.
 * 
 * Används för dagar som infaller på fasta datum, tex. Julafton, Nationaldagen 
 * och Första maj.
 * 
 * @returns {Holydate.prototype}
 */
Holydate.prototype.date = function() {
    this.register[this.index].type = 'date';
    return this;
};

/**
 * Sätter ett datum till typen 'weekday' och en viss veckodag.
 * 
 * Används för dagar som infaller på fasta veckodagar och variabla datum, tex. 
 * Midsommarafton, Alla helgons dag och Första advent.
 * 
 * @param {type} weekday 
 * @returns {undefined|Holydate.prototype}
 */
Holydate.prototype.weekday = function(weekday) {
    weekday = parseInt(weekday, 10);
    if (!this.isNum(weekday) || weekday < 1) {
        console.error('Invalid weekday number provided, must be an integer 1 (monday) to 7 (sunday)');
        return;
    }
    this.register[this.index].type = 'weekday';
    this.register[this.index].weekday = weekday;
    return this;
};

/**
 * Sätter ett datum till typen 'easter'.
 * 
 * Används för dagar som är relativa till infallande av påskdagen, tex. 
 * Långfredagen, Pingstdagen och Kristi himmelfärdsdag.
 * 
 * @returns {Holydate.prototype}
 */
Holydate.prototype.easter = function() {
    this.register[this.index].type = 'easter';
    return this;
};

/**
 * Sätter månadsnummer för en dag/datum.
 * 
 * @param {Number} month Månadens nummer (1=jan ... 12=dec)
 * @returns {undefined|Holydate.prototype}
 */
Holydate.prototype.month = function(month) {
    month = parseInt(month, 10);
    if (!this.isNum(month) || month < 1 || month > 12) {
        console.error('Invalid month provided, must be an integer 1 to 12');
        return;
    }
    this.register[this.index].month = month;
    return this;
};

/**
 * Sätter dagsnummer för en dag/datum.
 * 
 * @param {Number} day Dagens nummer (1 ... 31)
 * @returns {Holydate.prototype|undefined}
 */
Holydate.prototype.day = function(day) {
    day = parseInt(day, 10);
    if (!this.isNum(day) || day < 1 || day > 31) {
        console.error('Invalid day number provided, must be an integer 1 to 31');
        return;
    }
    this.register[this.index].day = day;
    return this;
};

/**
 * Sätter att den första veckodagen som matchar .weekday(num) ska retuneras.
 * 
 * @returns {Holydate.prototype}
 */
Holydate.prototype.first = function() {
    this.register[this.index].occurrence = 'first';
    return this;
};

/**
 * Sätter att den sista veckodagen som matchar .weekday(num) ska retuneras.
 * 
 * @returns {Holydate.prototype}
 */
Holydate.prototype.last = function() {
    this.register[this.index].occurrence = 'last';
    return this;
};

/**
 * Sätter ett interval av antal veckor i fram i tiden, i vilken en veckodag ska 
 * inträffa.
 * 
 * @param {Number} interval Antal veckor (fram i tiden)
 * @returns {Holydate.prototype|undefined}
 */
Holydate.prototype.interval = function(interval) {
    interval = parseInt(interval, 10);
    if (!this.isNum(interval) || interval < 1) {
        console.error('Invalid interval provided, must be an integer 1 or greater');
        return;
    }
    this.register[this.index].interval = interval;
    return this;
};

/**
 * Sätter antal avvikande dagar (postivt eller negativt) som ett datum ska 
 * avvika ifrån påskdagen.
 * 
 * @param {Number} offset Antal dagar (+/-)
 * @returns {undefined|Holydate.prototype}
 */
Holydate.prototype.offset = function(offset) {
    offset = parseInt(offset, 10);
    if (!this.isNum(offset)) {
        console.error('Invalid offset number provided, must be an integer');
        return;
    }
    this.register[this.index].offset = offset;
    return this;
};

/**
 * Beräkar en tidsstämpel för ett fast datum.
 * 
 * @param {String} index Namn på dagen
 * @param {Object} item Registrerat datum som ska beräknas (månad, dag)
 * @param {Number} ts Tidsstämpel för datum som ska beräknas (år)
 * @returns {Number} Beräknad tidsstämpel då datumet infaller
 */
Holydate.prototype.calcDate = function(index, item, ts) {
    if (!item.month) {
        console.error('Required month is missing for \''+index+'\', try adding .month(int)');
    } else if (!item.day) {
        console.error('Required day is missing for \''+index+'\', try adding .day(int)');
    }
    var now = new Date(ts);
    return new Date(now.getFullYear(), item.month-1, item.day).getTime();
};

/**
 * Beräknar en tidsstämpel för infallande av påskdagen. Avvikande dagar från 
 * påskdagen tas med i beräkningen. Avvikande dagar sätts med funktionen 
 * offset().
 * 
 * @param {Object} item Registrerat datum som ska beräknas (offset)
 * @param {Number} ts Tidsstämpel för datum som ska beräknas (år)
 * @returns {Number} Beräknad tidsstämpel då datumet infaller
 */
Holydate.prototype.calcEaster = function(item, ts) {
    if (!this.isNum(item.offset)) {
        item.offset = 0;
    }
    var year = new Date(ts).getFullYear();
    var a = year % 19,
    b = Math.floor(year / 100),
    c = year % 100,
    d = Math.floor(b / 4),
    e = b % 4,
    f = Math.floor((b + 8) / 25),
    g = Math.floor((b - f + 1) / 3),
    h = (((19*a) + (b - d - g)) + 15) % 30,
    i = Math.floor(c / 4),
    k = c % 4,
    L = (32 + (2*e) + (2*i) - h - k) % 7,
    m = Math.floor((a + (11*h) + (22*L)) / 451),
    M = Math.floor((h + L - (7*m) + 114) / 31),
    D = ((h + L - (7*m) + 114) % 31) + 1;    
    return new Date(year, M-1, (D+item.offset)).getTime();
};

/**
 * Beräkar en tidsstämpel för när en viss veckodag infaller, ut ifrån givna 
 * avgränsningar. Avgränsningar sätts med funktionerna .weekday(), .month(), 
 * .day(), .interval(), .first() och .last()
 * 
 * @param {String} index Namn på dagen
 * @param {Object} item Registrerat datum som ska beräknas (weekday, month, day, interval, occurrence)
 * @param {Number} ts Tidsstämpel för datum som ska beräknas (månad, dag)
 * @returns {Number|undefined} Beräknad tidsstämpel då datumet infaller, om en dag hittades
 */
Holydate.prototype.calcWeekday = function(index, item, ts) {
    if (!this.isNum(item.month)) {
        console.error('Required month is missing for \''+index+'\', try adding .month(int)');
    }
    item.day        = this.isNum(item.day) ? item.day : 1;
    item.occurrence = ['first','last'].indexOf(item.occurrence) > -1 ? item.occurrence : 'first';
    item.interval   = this.isNum(item.interval) ? item.interval : 1;
    
    var i, date, weekday;
    var in_date    = new Date(ts);
    var start_date = new Date(in_date.getFullYear(), item.month-1, (item.occurrence === 'first' ? item.day : 1));
    
    if (item.occurrence === 'first') {
        var end_date = new Date(start_date.getTime()+(7*item.interval*86400000)), 
            occurrences = 0;
        for (i = start_date.getTime(); i <= end_date.getTime(); i += 86400000) {
            date = new Date(i);
            weekday = date.getDay() === 0 ? 7 : date.getDay();  
            occurrences += weekday === item.weekday ? 1 : 0;
            if (in_date.getMonth() === date.getMonth() && in_date.getDate() === date.getDate() && weekday === item.weekday && occurrences === item.interval) {
                return i;
            }
        }
    } else if (item.occurrence === 'last') {
        var last_day = new Date(start_date.getFullYear(), start_date.getMonth()+1, 0),
            end_date = new Date(last_day.getTime());
        var last_occurrence;
        for (i = start_date.getTime(); i <= end_date.getTime(); i += 86400000) {
            date = new Date(i);
            weekday = date.getDay() === 0 ? 7 : date.getDay();
            last_occurrence = weekday === item.weekday ? date.getTime() : last_occurrence;
            if (in_date.getMonth() === date.getMonth() && in_date.getDate() === date.getDate() && weekday === item.weekday) {
                return last_occurrence;
            }
        }
    }
    
    return;
};

/**
 * Sätter namn på en dag/datum.
 * 
 * @param {type} name Namn på dagen
 * @returns {Holydate.prototype|undefined}
 */
Holydate.prototype.set = function(name) {
    if (typeof name !== 'string' || name === '') {
        console.error('Invalid name provided, must be a string');
        return;
    }
    this.index = name;
    if (!this.register[name]) {
        this.register[name] = {
            type: null,
            weekday: null,
            interval: null,
            month: null,
            day: null,
            occurrence: null,
            offset: null
        };
    }
    return this;
};

/**
 * Hämtar namn på dag (ett eller flera) för ett angivet datum.
 * 
 * @param {type} date Datumsträng
 * @returns {Array|null|undefined} Array med namn på de dagar som matchar angivet datum
 */
Holydate.prototype.get = function(date) {
    var ts = this.strToTime(date), index, item, result = [];
    if (!ts) {
        console.error('Provided date \''+date+'\' is invalid');
        return;
    }
    for (index in this.register) {
        item = this.register[index];
        if (item.type === 'date' && ts === this.calcDate(index, item, ts)) {
            result.push(index);
        }
        if (item.type === 'weekday' && ts === this.calcWeekday(index, item, ts)) {
            result.push(index);
        }
        if (item.type === 'easter' && ts === this.calcEaster(item, ts)) {
            result.push(index);
        }
    }
    return result.length > 0 ? result : null;
};
