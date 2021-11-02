/* eslint-disable no-restricted-syntax */
module.exports = function waiterAvailability(pool) {
  let day = [];
  let waiter;

  async function getNameID(name) {
    // eslint-disable-next-line no-param-reassign
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    let id = await pool.query('SELECT id FROM waiterNames WHERE names = $1', [name]);
    id = id.rows[0].id;
    return id;
  }
  async function setName(name) {
    // eslint-disable-next-line no-param-reassign
    waiter = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    // console.log(waiter);

    const noDuplicate = await pool.query('SELECT names from waiterNames WHERE names = $1', [waiter]);

    if (noDuplicate.rowCount === 0) {
      await pool.query('INSERT INTO waiterNames (names) VALUES ($1)', [waiter]);
    }
  }

  async function selectShift(string, name) {
    day = string;
    // let strId;
    const nameID = await getNameID(name);

    for (const i of day) {
      // eslint-disable-next-line no-await-in-loop
      // const dayIdentify = await pool.query('SELECT id FROM daysOfWeek WHERE daysWeek = $1', [i]);
      // eslint-disable-next-line no-await-in-loop
      await pool.query('INSERT INTO waiterDays (days_id, waiter_id) VALUES ($1,$2)', [i, nameID]);
    }
  }

  async function getWaiters() {
    const availWaiter = await pool.query(`SELECT waiterNames.names, daysOfWeek.daysWeek
    FROM waiterDays
INNER JOIN waiterNames ON waiterDays.waiter_id = waiterNames.id
INNER JOIN daysOfWeek
        ON waiterDays.days_id = daysOfWeek.id`);
    return availWaiter.rows;
  }

  async function getDays() {
    const theDays = await pool.query('SELECT id,daysWeek FROM daysOfWeek');
    return theDays.rows;
  }

  async function checkedDays(name) {
    const theDay = await getDays();
    const waiterID = await getNameID(name);

    for (const i of theDay) {
      // eslint-disable-next-line no-await-in-loop
      const result = await pool.query('SELECT COUNT(*) AS counter FROM waiterDays WHERE waiter_id = $1 and days_id = $2', [waiterID, i.id]);
      const counting = result.rows[0].counter;
      if (counting > 0) {
        i.check = true;
      } else {
        i.check = false;
      }
    }

    return theDay;
  }

  async function dayColour() {
    const theDay = await getDays();
    for (const y of theDay) {
      // eslint-disable-next-line no-await-in-loop
      const result = await pool.query('SELECT COUNT(*) AS counters FROM waiterDays WHERE days_id = $1', [y.id]);
      const dayCount = result.rows[0].counters;

      if (dayCount < 3) {
        y.color = 'bg-warning';
      } else if (dayCount > 3) {
        y.color = 'bg-danger';
      } else {
        y.color = 'bg-success';
      }
    }

    return theDay;
  }

  async function resetData() {
    await pool.query('DELETE  FROM waiterDays');
  }

  return {
    getNameID,
    setName,
    selectShift,
    getWaiters,
    resetData,
    checkedDays,
    getDays,
    dayColour,

  };
};
