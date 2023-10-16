const get_speed = (speed_table, timestamp_ms) => {
  const timestamp_s = timestamp_ms / 1000.0;

  var lower_index = speed_table.length - 1;
  for (var i = 0; i < speed_table.length - 1; i++)
  {
    if ((speed_table[i].t <= timestamp_s) && (timestamp_s < speed_table[i + 1].t))
    {
      return speed_table[i].speed;
    }
  }

  alert("dont come here.");
};
const get_speed_label = (speed_table, timestamp_ms) => {
  const s = get_speed(speed_table, timestamp_ms);

  if( 6.5 < s && s < 6.7 )
  {
    return "常歩";
  } else if( 13.1 < s && s < 13.3 ){
    return "速歩";
  } else if( 19.7 < s && s < 19.9 ){
    return "駈歩";
  } else {
    return "-";
  }
};

const get_length = (speed, timestamp_ms) => {
  const convert_kmph_to_mps = (kmph) => {
    const mph = kmph * 1000;
    const mps = mph / 3600;
    return mps;
  }

  const timestamp_s = timestamp_ms / 1000.0;

  var lower_index = speed.length - 1;
  for (var i = 0; i < speed.length - 1; i++)
  {
    if ((speed[i].t <= timestamp_s) && (timestamp_s < speed[i + 1].t))
    {
      lower_index = i;
      break;
    }
  }

  var length_m = 0;
  for (var i = 0; i < lower_index; i++)
  {
    length_m += (speed[i + 1].t - speed[i].t) * convert_kmph_to_mps(speed[i].speed);
  }
  length_m += (timestamp_s - speed[lower_index].t) * convert_kmph_to_mps(speed[lower_index].speed);

  return length_m;
};

const get_position = (path, length, speed) => {
  const calc_distance = (p1, p2) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const sq_sum = Math.pow(dx, 2) + Math.pow(dy, 2);
    return Math.sqrt(sq_sum);
  }
  const calc_unit_vec = (p1, p2) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = calc_distance(p1, p2);
    return [dx / dist, dy / dist];
  }
  const mul = (vec, alpha) => [vec[0] * alpha, vec[1] * alpha];
  const add = (p, vec) => [p.x + vec[0], p.y + vec[1]];

  var base_index = null;
  var remain_length = length;
  for (var i = 0; i < path.length - 1; i++)
  {
    const next_length = calc_distance(path[i], path[i + 1]);

    if (remain_length < next_length) {
      base_index = i;
      break;
    }

    remain_length -= next_length;
  }

  if (base_index == null)
  {
    // pathが途切れたらとりあえず止まっとけ。
    const last = path[path.length - 1];
    return [last.x, last.y, 0, 1];
  }
  else
  {
    const unit_vec = calc_unit_vec(path[base_index], path[base_index + 1]);
    const vec = mul(unit_vec, remain_length);
    const [x, y] = add(path[base_index], vec);

    var ux = unit_vec[0];
    var uy = unit_vec[1];
    if (speed < 0.1) { // todo: 止まっていたら無理やり下を向ける
      ux = 0;
      uy = 1;
    }

    return [x, y, ux, uy];
  }
};

// todo: 百歩譲って二分探索使うにしても実装が適当すぎる。
const get_time = (speed, path, target_index) => {
  const calc_distance = (p1, p2) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const sq_sum = Math.pow(dx, 2) + Math.pow(dy, 2);
    return Math.sqrt(sq_sum);
  }

  var length = 0.0;
  for (var i = 0; i < target_index; i++) {
    length += calc_distance(path[i], path[i + 1]);
  }

  var count = 0;
  var left_s = 0;
  var right_s = 1000;
  while(true) {
    const center_s = (left_s + right_s) / 2;
    const d = get_length(speed, center_s * 1000);

    if (d < length) {
      left_s = center_s;
    } else {
      right_s = center_s;
    }

    count += 1;
    if (count > 500) {
      return center_s;
    }
  }
};

const convert = (x, y, w, h, x_max, y_max, canvas_width, canvas_height) => {
  const cx = canvas_width * x / x_max;
  const cy = canvas_height * y / y_max;
  const cw = canvas_width * w / x_max;
  const ch = canvas_height * h / y_max;

  return [cx, cy, cw, ch];
};

