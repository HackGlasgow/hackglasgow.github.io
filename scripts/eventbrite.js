import fs from "fs";

const TOKEN = process.env.EVENTBRITE_TOKEN;
const EVENT_ID = process.env.EVENTBRITE_EVENT_ID;
const FILE_PATH = "stats.html";

if (!TOKEN || !EVENT_ID) {
  throw new Error("Missing EVENTBRITE_TOKEN or EVENTBRITE_EVENT_ID");
}

const API = "https://www.eventbriteapi.com/v3";

const GA_TICKETS = [
  "General Admission",
  "General Admission (Hack Thursday)",
  "Pay it Forward"
];

const ALLOC_KEYWORDS = {
  ORGANISER: "organiser",
  CREW: "crew",
  SPEAKER: "speaker",
  SPONSOR: "sponsor",
  VILLAGE: "village",
  PRESS: "press"
};

async function fetchAllOrders() {
  let orders = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(
      `${API}/events/${EVENT_ID}/orders/?page=${page}&expand=attendees`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    if (!res.ok) {
      throw new Error(`Eventbrite API error: ${res.status}`);
    }

    const data = await res.json();
    orders.push(...data.orders);
    hasMore = data.pagination.has_more_items;
    page++;
  }

  return orders;
}

function isGATicket(att) {
  return GA_TICKETS.includes(att.ticket_class_name);
}

function monthIndex(date) {
  return date.getMonth(); // Jan = 0
}

function weekIndex(date) {
  const start = new Date("2026-01-12T00:00:00Z");
  if (date < start) return -1;
  const diff = date - start;
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
}

function replaceBetween(content, start, end, value) {
  const regex = new RegExp(
    `(\\/\\* ${start} \\*\\/)[\\s\\S]*?(\\/\\* ${end} \\*\\/)`,
    "g"
  );
  return content.replace(regex, `$1 ${value} $2`);
}

function replaceBetween2(content, start, end, value) {
  const regex = new RegExp(
    `(<!-- ${start} -->)[\\s\\S]*?(<!-- ${end} -->)`,
    "g"
  );
  return content.replace(regex, `$1 ${value} $2`);
}

(async () => {
  const orders = await fetchAllOrders();

  const now = new Date();
  const currentMonth = now.getMonth();
  const lastUpdated = new Date().toISOString();

  const monthly = Array(currentMonth + 1).fill(0);
  const weekly = [];

  let alloc = {
    GA: 0,
    ORGANISER: 0,
    CREW: 0,
    SPEAKER: 0,
    SPONSOR: 0,
    VILLAGE: 0,
    PRESS: 0
  };

  let pifCount = 0;

  for (const order of orders) {
    for (const att of order.attendees || []) {
      const created = new Date(att.created);

      if (isGATicket(att)) {
        // Monthly
        const m = monthIndex(created);
        if (m <= currentMonth) {
          monthly[m]++;
        }

        // Weekly
        const w = weekIndex(created);
        if (w >= 0) {
          weekly[w] = (weekly[w] || 0) + 1;
        }

        alloc.GA++;

        if (att.ticket_class_name === "Pay it Forward") {
          pifCount++;
        }
      }

      const name = (att.ticket_class_name || "").toLowerCase();
      for (const key of Object.keys(ALLOC_KEYWORDS)) {
        if (name.includes(ALLOC_KEYWORDS[key])) {
          alloc[key]++;
        }
      }
    }
  }

  const monthlyStr = `[${monthly.join(",")}]`;
  const weeklyStr = `[${weekly.join(",")}]`;

  let file = fs.readFileSync(FILE_PATH, "utf8");

  file = replaceBetween(file, "MONTHLY_SALES_START", "MONTHLY_SALES_END", monthlyStr);
  file = replaceBetween(file, "WEEKLY_SALES_START", "WEEKLY_SALES_END", weeklyStr);

  file = replaceBetween(file,"TOTAL_ALLOC_GA_START","TOTAL_ALLOC_GA_END",alloc.GA);
  file = replaceBetween(file,"TOTAL_ALLOC_ORGANISER_START","TOTAL_ALLOC_ORGANISER_END",alloc.ORGANISER);
  file = replaceBetween(file,"TOTAL_ALLOC_CREW_START","TOTAL_ALLOC_CREW_END",alloc.CREW);
  file = replaceBetween(file,"TOTAL_ALLOC_SPEAKER_START","TOTAL_ALLOC_SPEAKER_END",alloc.SPEAKER);
  file = replaceBetween(file,"TOTAL_ALLOC_SPONSOR_START","TOTAL_ALLOC_SPONSOR_END",alloc.SPONSOR);
  file = replaceBetween(file,"TOTAL_ALLOC_VILLAGE_START","TOTAL_ALLOC_VILLAGE_END",alloc.VILLAGE);
  file = replaceBetween(file,"TOTAL_ALLOC_PRESS_START","TOTAL_ALLOC_PRESS_END",alloc.PRESS);
  file = replaceBetween(file,"PIF_START","PIF_END",pifCount);
  
  file = replaceBetween2(file, "LAST_UPDATED_START", "LAST_UPDATED_END", lastUpdated);

  fs.writeFileSync(FILE_PATH, file);
})();
