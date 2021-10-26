/* eslint-disable no-restricted-syntax */
module.exports = function waiterAvailability(pool) {
  let waiter;
  let day = [];

  async function setName(name) {
    // eslint-disable-next-line no-param-reassign
    waiter = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    // console.log(waiter);

    const noDuplicate = await pool.query('SELECT names from waiterNames WHERE names = $1', [waiter]);

    if (noDuplicate.rowCount === 0) {
      await pool.query('INSERT INTO waiterNames (names) VALUES ($1)', [waiter]);
    }
  }

  async function setNameID() {
    const nameIdentify = await pool.query('SELECT id FROM waiterNames WHERE names = $1', [waiter]);
    // eslint-disable-next-line prefer-destructuring
    const id = nameIdentify.rows[0].id;
    return Number(id);
  }

  async function selectShift(string) {
    day = string;
    const arrayId = [];
    let strId;
    const nameID = await setNameID();

    for (const i of day) {
      const dayIdentify = await pool.query('SELECT id FROM daysOfWeek WHERE daysWeek = $1', [i]);
      strId = dayIdentify.rows[0].id;
      arrayId.push(strId);
      console.log(nameID);
      console.log(strId);
      await pool.query('INSERT INTO waiterDays (days_id, waiter_id) VALUES ($1,$2)', [strId,nameID]);

    }

   

    // const results = await pool.query('SELECT * FROM waiterDays');
    // console.log(results.rows);
    // return results.rows;
  
}

  async function resetData() {
    await pool.query('DELETE  FROM waiterDays');
  }

  return {
    setName,
    selectShift,
    setNameID,
    resetData,

  };
};
