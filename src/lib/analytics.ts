// Thin Mixpanel wrapper. Works the moment NEXT_PUBLIC_MIXPANEL_TOKEN is set;
// without a token it no-ops (and logs to the console in dev) so the app runs
// fine and every event is still wired and visible.
type Props = Record<string, unknown>;

const TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
let mp: typeof import("mixpanel-browser").default | null = null;
let inited = false;

async function ensure() {
  if (typeof window === "undefined" || !TOKEN) return null;
  if (!mp) mp = (await import("mixpanel-browser")).default;
  if (!inited) {
    mp.init(TOKEN, { persistence: "localStorage" });
    inited = true;
  }
  return mp;
}

export function track(event: string, props: Props = {}) {
  if (!TOKEN) {
    if (process.env.NODE_ENV !== "production") console.debug("[analytics]", event, props);
    return;
  }
  ensure().then((m) => m?.track(event, props));
}

export function identify(id: string, name?: string) {
  if (!TOKEN) return;
  ensure().then((m) => {
    if (!m) return;
    m.identify(id);
    if (name) m.people.set({ $name: name });
  });
}
