module.exports = function waiterAvailability(pool) {
  let waiter;
  let day;

  async function setName(name) {
    // eslint-disable-next-line no-param-reassign
    waiter = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    // console.log(waiter);

    const noDuplicate = await pool.query('SELECT names from waiterNames WHERE names = $1', [waiter]);

    if (noDuplicate.rowCount === 0) {
      await pool.query('INSERT INTO waiterNames (names) VALUES ($1)', [waiter]);
    }
  }

  async function setDayID(string) {
    day = string;
    const dayIdentify = await pool.query('SELECT day FROM daysOfWeek WHERE daysWeek = $1', [day]);
    // eslint-disable-next-line prefer-destructuring
    const id = dayIdentify.rows[0].id;
    return Number(id);
  }

  async function setNameID() {
    const nameIdentify = await pool.query('SELECT id FROM waiterNames WHERE names = $1', [waiter]);
    // eslint-disable-next-line prefer-destructuring
    const id = nameIdentify.rows[0].id;
    return Number(id);
  }

  async function selectShift() {
    const waiterID = setNameID();
    const nameID = setDayID(day);
    await pool.query('INSERT INTO waiterDays (days_id, waiter_id) values ($1,$2)', [nameID, waiterID]);
  }

  return {
    setName,
    setDayID,
    setNameID,
    selectShift,

  };
};
