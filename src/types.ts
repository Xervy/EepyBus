export type Destination = {
  latitude: number;
  longitude: number;
};

export type Result = { ok: true } | { ok: false; reason: string };
