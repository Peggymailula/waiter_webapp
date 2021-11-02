/* eslint-disable no-undef */
const assert = require('assert');
const pg = require('pg');
const waiter = require('../services/waiters');
// const availe = require('../routes/waitersRoutes');

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/waiters';

const pool = new Pool({
  connectionString,
});

beforeEach(async () => {
  await pool.query('delete from waiterDays;');
});

describe('Should return the waiter\'s names and days selected for the shifts available', async () => {
  it('Add Peggy as the name in the system', async () => {
    const waiter1 = waiter(pool);
    await waiter1.setName('Peggy');
    await waiter1.selectShift([1, 2], 'Peggy');

    assert.deepEqual([{
      daysweek: 'Monday',
      names: 'Peggy',
    }, {
      daysweek: 'Tuesday',
      names: 'Peggy',
    }],
    await waiter1.getWaiters());
  });
  it('Should return the name Lusanda and days selected for the shifts available', async () => {
    const waiter1 = waiter(pool);
    await waiter1.setName('Lusanda');
    await waiter1.getNameID('Lusanda');
    await waiter1.selectShift([3, 5, 7], 'Lusanda');

    assert.deepEqual([{
      daysweek: 'Wednesday',
      names: 'Lusanda',
    }, {
      daysweek: 'Friday',
      names: 'Lusanda',
    }, {
      daysweek: 'Sunday',
      names: 'Lusanda',
    }],
    await waiter1.getWaiters());
  });

  it('Should return the names of Lusanda,Peggy,Ziyanda & Bella and days selected for the shifts available', async () => {
    const waiter1 = waiter(pool);
    await waiter1.setName('Lusanda');
    await waiter1.getNameID('Lusanda');
    await waiter1.selectShift([1, 2, 3], 'Lusanda');

    await waiter1.setName('Peggy');
    await waiter1.getNameID('Peggy');
    await waiter1.selectShift([4, 5, 6], 'Peggy');

    await waiter1.setName('Ziyanda');
    await waiter1.getNameID('Ziyanda');
    await waiter1.selectShift([3, 5, 7], 'Ziyanda');

    await waiter1.setName('Bella');
    await waiter1.getNameID('Bella');
    await waiter1.selectShift([1, 5], 'Bella');

    assert.deepEqual([{
      daysweek: 'Monday',
      names: 'Lusanda',
    }, {
      daysweek: 'Tuesday',
      names: 'Lusanda',
    }, {
      daysweek: 'Wednesday',
      names: 'Lusanda',
    },
    {
      daysweek: 'Thursday',
      names: 'Peggy',
    }, {
      daysweek: 'Friday',
      names: 'Peggy',
    }, {
      daysweek: 'Saturday',
      names: 'Peggy',
    }, {
      daysweek: 'Wednesday',
      names: 'Ziyanda',
    }, {
      daysweek: 'Friday',
      names: 'Ziyanda',
    }, {
      daysweek: 'Sunday',
      names: 'Ziyanda',
    }, {
      daysweek: 'Monday',
      names: 'Bella',
    }, {
      daysweek: 'Friday',
      names: 'Bella',
    }],
    await waiter1.getWaiters());
  });
});
describe('Should return the correct colour (orange/red/green) to verify status of waiters available to cover shifts', async () => {
  it('Add Peggy as the name in the system', async () => {
    const waiter1 = waiter(pool);

    await waiter1.resetData();
    await waiter1.setName('Peggy');
    await waiter1.getNameID('Peggy');
    await waiter1.selectShift([1, 2], 'Peggy');

    await waiter1.setName('Bella');
    await waiter1.getNameID('Bella');
    await waiter1.selectShift([2, 3], 'Bella');
    await waiter1.getWaiters();

    assert.deepEqual([
      {
        color: 'bg-warning',
        daysweek: 'Monday',
        id: 1,
      },
      {
        color: 'bg-warning',
        daysweek: 'Tuesday',
        id: 2,
      },
      {
        color: 'bg-warning',
        daysweek: 'Wednesday',
        id: 3,
      },
      {
        color: 'bg-warning',
        daysweek: 'Thursday',
        id: 4,
      },
      {
        color: 'bg-warning',
        daysweek: 'Friday',
        id: 5,
      },
      {
        color: 'bg-warning',
        daysweek: 'Saturday',
        id: 6,
      },
      {
        color: 'bg-warning',
        daysweek: 'Sunday',
        id: 7,
      },
    ],
    await waiter1.dayColour());
  });
  it('Should return the name Lusanda and days selected for the shifts available', async () => {
    const waiter1 = waiter(pool);

    await waiter1.resetData();
    await waiter1.setName('Lusanda');
    await waiter1.getNameID('Lusanda');
    await waiter1.selectShift([1, 2, 3], 'Lusanda');

    await waiter1.setName('Peggy');
    await waiter1.getNameID('Peggy');
    await waiter1.selectShift([1, 5, 6], 'Peggy');

    await waiter1.setName('Ziyanda');
    await waiter1.getNameID('Ziyanda');
    await waiter1.selectShift([3, 1, 7], 'Ziyanda');

    await waiter1.setName('Bella');
    await waiter1.getNameID('Bella');
    await waiter1.selectShift([1, 5, 3], 'Bella');

    await waiter1.getWaiters();

    assert.deepEqual([
      {
        color: 'bg-danger',
        daysweek: 'Monday',
        id: 1,
      },
      {
        color: 'bg-warning',
        daysweek: 'Tuesday',
        id: 2,
      },
      {
        color: 'bg-success',
        daysweek: 'Wednesday',
        id: 3,
      },
      {
        color: 'bg-warning',
        daysweek: 'Thursday',
        id: 4,
      },
      {
        color: 'bg-warning',
        daysweek: 'Friday',
        id: 5,
      },
      {
        color: 'bg-warning',
        daysweek: 'Saturday',
        id: 6,
      },
      {
        color: 'bg-warning',
        daysweek: 'Sunday',
        id: 7,
      },
    ],
    await waiter1.dayColour());
  });

  it('Should return all the days to the default orange colour after reseting', async () => {
    const waiter1 = waiter(pool);

    await waiter1.setName('Lusanda');
    await waiter1.getNameID('Lusanda');
    await waiter1.selectShift([1, 2, 3], 'Lusanda');

    await waiter1.setName('Peggy');
    await waiter1.getNameID('Peggy');
    await waiter1.selectShift([1, 5, 6], 'Peggy');

    await waiter1.setName('Ziyanda');
    await waiter1.getNameID('Ziyanda');
    await waiter1.selectShift([3, 1, 7], 'Ziyanda');

    await waiter1.setName('Bella');
    await waiter1.getNameID('Bella');
    await waiter1.selectShift([1, 5, 3], 'Bella');
    await waiter1.getWaiters();
    await waiter1.resetData();

    assert.deepEqual([
      {
        color: 'bg-warning',
        daysweek: 'Monday',
        id: 1,
      },
      {
        color: 'bg-warning',
        daysweek: 'Tuesday',
        id: 2,
      },
      {
        color: 'bg-warning',
        daysweek: 'Wednesday',
        id: 3,
      },
      {
        color: 'bg-warning',
        daysweek: 'Thursday',
        id: 4,
      },
      {
        color: 'bg-warning',
        daysweek: 'Friday',
        id: 5,
      },
      {
        color: 'bg-warning',
        daysweek: 'Saturday',
        id: 6,
      },
      {
        color: 'bg-warning',
        daysweek: 'Sunday',
        id: 7,
      },
    ],
    await waiter1.dayColour());
  });
});

after(() => {
  pool.end();
});
