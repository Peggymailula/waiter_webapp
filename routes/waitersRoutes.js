module.exports = function waiterAvailed(waiterAvail) {
  let name = '';
  let weeks = [];

  async function home(req, res) {
    res.render('index');
  }
  async function getNames(req, res) {
    name = req.body.inputName;
    // eslint-disable-next-line no-unused-expressions
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    await waiterAvail.setName(name);
    // eslint-disable-next-line no-console
    res.redirect(`/${name}`);
  }
  async function setDays(req, res) {
    req.params.name = name;
    weeks = await waiterAvail.checkedDays(name);

    res.render('days', { name, weeks });
  }
  async function getDays(req, res) {
    name = req.params.name;
    const weekdays = req.body.days;
    if (weekdays.length === 1) {
      req.flash('errors', 'Please select more than one day.');
    } else {
      req.flash('success', 'Checked days added succesfully to your shifts.');
      await waiterAvail.setName(name);
      await waiterAvail.selectShift(weekdays, name);
    }

    res.redirect(name);
  }

  async function logout(req, res) {
    res.redirect('/');
  }
  async function waitersAvailable(req, res) {
    const waitering = await waiterAvail.getWaiters();
    weeks = await waiterAvail.dayColour();

    const Monday = [];
    const Tuesday = [];
    const Wednesday = [];
    const Thursday = [];
    const Friday = [];
    const Saturday = [];
    const Sunday = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const x of waitering) {
      if (x.daysweek === 'Monday') {
        Monday.push(x.names);
      }
      if (x.daysweek === 'Tuesday') {
        Tuesday.push(x.names);
      }
      if (x.daysweek === 'Wednesday') {
        Wednesday.push(x.names);
      }
      if (x.daysweek === 'Thursday') {
        Thursday.push(x.names);
      }
      if (x.daysweek === 'Friday') {
        Friday.push(x.names);
      }
      if (x.daysweek === 'Saturday') {
        Saturday.push(x.names);
      }
      if (x.daysweek === 'Sunday') {
        Sunday.push(x.names);
      }
    }

    res.render('owner', {
      weeks,
      Monday,
      Tuesday,
      Wednesday,
      Thursday,
      Friday,
      Saturday,
      Sunday,

    });
  }
  async function schedule(req, res) {
    waiterAvail.resetData();
    req.flash('reset', 'There are currently no waiters available to work for the week.');
    res.redirect('/waiters/admin');
  }

  return {
    home,
    getNames,
    setDays,
    getDays,
    logout,
    waitersAvailable,
    schedule,
  };
};
