const Config = (() => {
  /*
   * TL(0,0)    TR(20,0)
   * ┌-----A----┐
   * |           |
   * F        S  K
   * |           |
   * |           |
   * |           |
   * B     X     E
   * |           |
   * |           |
   * |           |
   * M           H
   * |           |
   * └-----C----┘
   * BL(0,40)   BR(20,40)
   */
  const TL = { x: 0, y: 0 };
  const TR = { x: 20, y: 0 };
  const BL = { x: 0, y: 40 };
  const BR = { x: 20, y: 40 };
  const A = { x: 10, y: 0 };
  const B = { x: 0, y: 20 };
  const C = { x: 10, y: 40 };
  const E = { x: 20, y: 20 };
  const F = { x: 0, y: 6 };
  const H = { x: 20, y: 34 };
  const K = { x: 20, y: 6 };
  const M = { x: 0, y: 34 };
  const X = { x: 10, y: 20 };
  const S = { x: 20 - 2.5, y: 2.5 };

  const CORNER_RADIUS = 3.0;
  const TL_CORNER_CENTER = { x: CORNER_RADIUS, y: CORNER_RADIUS };
  const BL_CORNER_CENTER = { x: CORNER_RADIUS, y: 40 - CORNER_RADIUS };
  const BR_CORNER_CENTER = { x: 20 - CORNER_RADIUS, y: 40 - CORNER_RADIUS };
  const TR_CORNER_CENTER = { x: 20 - CORNER_RADIUS, y: CORNER_RADIUS };

  const SERPENTINE3LOOPS_RADIUS = 40.0 / 3 / 2;
  const SERPENTINE3LOOPS_LEFT_TOP_CENTER = { x: SERPENTINE3LOOPS_RADIUS, y: SERPENTINE3LOOPS_RADIUS };
  const SERPENTINE3LOOPS_LEFT_MIDDLE_CENTER = { x: SERPENTINE3LOOPS_RADIUS, y: SERPENTINE3LOOPS_RADIUS * 3 };
  const SERPENTINE3LOOPS_LEFT_BOTTOM_CENTER = { x: SERPENTINE3LOOPS_RADIUS, y: SERPENTINE3LOOPS_RADIUS * 5 };
  const SERPENTINE3LOOPS_RIGHT_TOP_CENTER = { x: 20 - SERPENTINE3LOOPS_RADIUS, y: SERPENTINE3LOOPS_RADIUS };
  const SERPENTINE3LOOPS_RIGHT_MIDDLE_CENTER = { x: 20 - SERPENTINE3LOOPS_RADIUS, y: SERPENTINE3LOOPS_RADIUS * 3 };
  const SERPENTINE3LOOPS_RIGHT_BOTTOM_CENTER = { x: 20 - SERPENTINE3LOOPS_RADIUS, y: SERPENTINE3LOOPS_RADIUS * 5 };

  const SMALL_CIRCLE_RADIUS = 10.0;
  const SMAL_CIRCLE_ODD_CENTER = { x: SMALL_CIRCLE_RADIUS, y: SMALL_CIRCLE_RADIUS };
  const SMAL_CIRCLE_EVEN_CENTER = { x: SMALL_CIRCLE_RADIUS, y: SMALL_CIRCLE_RADIUS * 3 };

  const MEAN = (p1, p2) => {
    return MEAN_WEIGHT(p1, p2, 0.5);
  }
  const MEAN_WEIGHT = (p1, p2, alpha) => {
    const dx = (p2.x - p1.x) * alpha;
    const dy = (p2.y - p1.y) * alpha;
    return { x: p1.x + dx, y: p1.y + dy };
  }

  const GENERATE_ARC = (center, radius, divide, start_theta, end_theta) => {
    const delta_theta = (end_theta - start_theta) / divide;

    var result = [];
    for (var i = 0; i < divide + 1; i++){
      const theta = start_theta + delta_theta * i;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      result.push({ x: center.x + x, y: center.y + y });
    }

    return result;
  }

  const PATH_TL_CORNER_CCW = GENERATE_ARC(TL_CORNER_CENTER, CORNER_RADIUS, 10, -Math.PI / 2, -Math.PI);
  const PATH_BL_CORNER_CCW = GENERATE_ARC(BL_CORNER_CENTER, CORNER_RADIUS, 10, Math.PI, Math.PI / 2);
  const PATH_BR_CORNER_CCW = GENERATE_ARC(BR_CORNER_CENTER, CORNER_RADIUS, 10, Math.PI / 2, 0);
  const PATH_TR_CORNER_CCW = GENERATE_ARC(TR_CORNER_CENTER, CORNER_RADIUS, 10, 0, -Math.PI / 2);

  const PATH_TL_CORNER_CW = GENERATE_ARC(TL_CORNER_CENTER, CORNER_RADIUS, 10, -Math.PI, -Math.PI / 2);
  const PATH_BL_CORNER_CW = GENERATE_ARC(BL_CORNER_CENTER, CORNER_RADIUS, 10, Math.PI / 2, Math.PI);
  const PATH_BR_CORNER_CW = GENERATE_ARC(BR_CORNER_CENTER, CORNER_RADIUS, 10, 0, Math.PI / 2);
  const PATH_TR_CORNER_CW = GENERATE_ARC(TR_CORNER_CENTER, CORNER_RADIUS, 10, -Math.PI / 2, 0);

  const PATH_TO_ENTER = [
    PATH_TL_CORNER_CCW,
    PATH_BL_CORNER_CCW,
    PATH_BR_CORNER_CCW,
    PATH_TR_CORNER_CCW,
    A,
    { x: 10, y: 10 },
  ];

  const PATH_BEFORE_TROT_ODD = [
    PATH_BL_CORNER_CCW,
    C,
    A,
    PATH_TL_CORNER_CCW,
    PATH_BL_CORNER_CCW,
  ];
  const PATH_BEFORE_TROT_EVEN = [
    PATH_BR_CORNER_CW,
    C,
    A,
    PATH_TL_CORNER_CCW,
    PATH_BL_CORNER_CCW,
  ];

  const PATH_SERPENTINE3LOOPS = [
    PATH_BR_CORNER_CCW,
    PATH_TR_CORNER_CCW,
    GENERATE_ARC(SERPENTINE3LOOPS_LEFT_TOP_CENTER, SERPENTINE3LOOPS_RADIUS, 37, -Math.PI / 2, -Math.PI * 3 / 2),
    GENERATE_ARC(SERPENTINE3LOOPS_RIGHT_MIDDLE_CENTER, SERPENTINE3LOOPS_RADIUS, 37, -Math.PI / 2, Math.PI / 2),
    GENERATE_ARC(SERPENTINE3LOOPS_LEFT_BOTTOM_CENTER, SERPENTINE3LOOPS_RADIUS, 37, -Math.PI / 2, -Math.PI * 3 / 2),
    PATH_BR_CORNER_CCW,
    H,
    F,
    PATH_TL_CORNER_CW,
    GENERATE_ARC(SERPENTINE3LOOPS_RIGHT_TOP_CENTER, SERPENTINE3LOOPS_RADIUS, 37, -Math.PI / 2, Math.PI / 2),
    GENERATE_ARC(SERPENTINE3LOOPS_LEFT_MIDDLE_CENTER, SERPENTINE3LOOPS_RADIUS, 37, -Math.PI / 2, -Math.PI * 3 / 2),
    GENERATE_ARC(SERPENTINE3LOOPS_RIGHT_BOTTOM_CENTER, SERPENTINE3LOOPS_RADIUS, 37, -Math.PI / 2, Math.PI / 2),
    PATH_BL_CORNER_CW,
    PATH_TL_CORNER_CW,
  ];
  const PATH_SEPARETE_CENTER_ODD = [
    A,
    C,
    PATH_BR_CORNER_CCW,
    PATH_TR_CORNER_CCW,
    PATH_TL_CORNER_CCW,
  ];
  const PATH_SEPARETE_CENTER_EVEN = [
    A,
    C,
    PATH_BL_CORNER_CW,
    MEAN(F, TL),
    S,
  ];
  const PATH_SEPARETE_CIRCLE_ODD = GENERATE_ARC(SMAL_CIRCLE_ODD_CENTER, SMALL_CIRCLE_RADIUS, 37, Math.PI, -2 * Math.PI - Math.PI / 2);
  const PATH_SEPARETE_CIRCLE_EVEN = [
    E,
    GENERATE_ARC(SMAL_CIRCLE_EVEN_CENTER, SMALL_CIRCLE_RADIUS, 37, 0, 3 * Math.PI + Math.PI / 2),
    GENERATE_ARC(SMAL_CIRCLE_ODD_CENTER, SMALL_CIRCLE_RADIUS, 19, Math.PI / 2, -Math.PI / 2),
  ];

  /* start delta
   *  常歩で4m進むのに要する時間: 2.18181818182sec

   *  1-3の時間差: 62.932 - 60.363 = 2.569
   *  8m : 2.182 * 2 = 4.364
   *  4.364 - 2.569 = 1.795

   *  1-5の時間差: 65.501 - 60.363 = 5.138
   *  16m : 2.182 * 4 = 8.728
   *  8.728 - 5.138 = 3.590

   *  1-7の時間差: 68.077 - 60.363 = 7.714
   *  24m : 2.182 * 6 = 13.092
   *  13.092 - 7.714 = 5.378
   */

  return {
    "settings": {
      width: 20, // unit: meter
      height: 40, // unit: meter
      numberOfHorses: 1,
      properties: [
        {
          name: "1:",
          color: "rgb(255, 0, 0)",
        },
        {
          name: "2:",
          color: "rgb(0, 255, 0)",
        },
        {
          name: "3:",
          color: "rgb(0, 0, 255)",
        },
        {
          name: "4:まっど",
          color: "rgb(255, 255, 0)",
        },
        {
          name: "5:",
          color: "rgb(255, 0, 255)",
        },
        {
          name: "6:せきと",
          color: "rgb(0, 255, 255)",
        },
        {
          name: "7:あーさー",
          color: "rgb(255, 255, 255)",
        },
      ],
    },
    "pathes": [
      // 1
      [
        { x: 20, y: 0 },
        // to enter
        PATH_TO_ENTER,
        // to start position
        { x: 0, y: 20 },
        // to 常足 end
        PATH_BEFORE_TROT_ODD,
        // to 3湾曲 end
        PATH_SERPENTINE3LOOPS,
        // to 分岐 end
        PATH_SEPARETE_CENTER_ODD,
        // to 分裂輪乗り end
        PATH_SEPARETE_CIRCLE_ODD,
        // to 輪乗り end
        PATH_TL_CORNER_CCW,
        GENERATE_ARC(X, 10, 36, Math.PI, -6 * Math.PI),
        // to finish positino
        PATH_TR_CORNER_CCW,
        A,
        { x: 10, y: 10 },
        { x: 0, y: 20 },
      ].flat(Infinity),
      // 2
      [
        { x: 24, y: 0 },
        // to enter
        PATH_TO_ENTER,
        // to start position
        { x: 20, y: 20 },
        // to 常足 end
        PATH_BEFORE_TROT_EVEN,
        // to 3湾曲 end
        PATH_SERPENTINE3LOOPS,
        // to 分岐 end
        PATH_SEPARETE_CENTER_EVEN,
        // to 分裂輪乗り end
        PATH_SEPARETE_CIRCLE_EVEN,
        // to 輪乗り end
        PATH_TL_CORNER_CCW,
        GENERATE_ARC(X, 10, 36, Math.PI, -6 * Math.PI),
        // to finish positino
        PATH_TR_CORNER_CCW,
        A,
        { x: 10, y: 10 },
        { x: 20 - 6.6, y: 20 + 6.6 },
      ].flat(Infinity),
      // 3
      [
        { x: 28, y: 0 },
        // to enter
        PATH_TO_ENTER,
        // to start position
        { x: 3.33, y: 20 - 3.33 },
        { x: 0, y: 20 },
        // to 常足 end
        PATH_BEFORE_TROT_ODD,
        // to 3湾曲 end
        PATH_SERPENTINE3LOOPS,
        // to 分岐 end
        PATH_SEPARETE_CENTER_ODD,
        // to 分裂輪乗り end
        PATH_SEPARETE_CIRCLE_ODD,
        // to 輪乗り end
        PATH_TL_CORNER_CCW,
        GENERATE_ARC(X, 10, 36, Math.PI, -6 * Math.PI),
        // to finish positino
        PATH_TR_CORNER_CCW,
        A,
        { x: 10, y: 10 },
        { x: 3.3, y: 20 + 3.3 },
      ].flat(Infinity),
      // 4
      [
        { x: 32, y: 0 },
        // to enter
        PATH_TO_ENTER,
        // to start position
        { x: 20 - 3.33, y: 20 - 3.33 },
        { x: 20, y: 20 },
        // to 常足 end
        PATH_BEFORE_TROT_EVEN,
        // to 3湾曲 end
        PATH_SERPENTINE3LOOPS,
        // to 分岐 end
        PATH_SEPARETE_CENTER_EVEN,
        // to 分裂輪乗り end
        PATH_SEPARETE_CIRCLE_EVEN,
        // to 輪乗り end
        PATH_TL_CORNER_CCW,
        GENERATE_ARC(X, 10, 36, Math.PI, -6 * Math.PI),
        // to finish positino
        PATH_TR_CORNER_CCW,
        A,
        { x: 10, y: 10 },
        { x: 20 - 3.3, y: 20 + 3.3 },
      ].flat(Infinity),
      // 5
      [
        { x: 36, y: 0 },
        // to enter
        PATH_TO_ENTER,
        // to start position
        { x: 6.66, y: 20 - 6.66 },
        { x: 0, y: 20 },
        // to 常足 end
        PATH_BEFORE_TROT_ODD,
        // to 3湾曲 end
        PATH_SERPENTINE3LOOPS,
        // to 分岐 end
        PATH_SEPARETE_CENTER_ODD,
        // to 分裂輪乗り end
        PATH_SEPARETE_CIRCLE_ODD,
        // to 輪乗り end
        PATH_TL_CORNER_CCW,
        GENERATE_ARC(X, 10, 36, Math.PI, -6 * Math.PI),
        // to finish positino
        PATH_TR_CORNER_CCW,
        A,
        { x: 10, y: 10 },
        { x: 6.6, y: 20 + 6.6 },
      ].flat(Infinity),
      // 6
      [
        { x: 40, y: 0 },
        // to enter
        PATH_TO_ENTER,
        // to start position
        { x: 20 - 6.66, y: 20 - 6.66 },
        { x: 20, y: 20 },
        // to 常足 end
        PATH_BEFORE_TROT_EVEN,
        // to 3湾曲 end
        PATH_SERPENTINE3LOOPS,
        // to 分岐 end
        PATH_SEPARETE_CENTER_EVEN,
        // to 分裂輪乗り end
        PATH_SEPARETE_CIRCLE_EVEN,
        // to 輪乗り end
        PATH_TL_CORNER_CCW,
        GENERATE_ARC(X, 10, 36, Math.PI, -6 * Math.PI),
        // to finish positino
        PATH_TR_CORNER_CCW,
        A,
        { x: 10, y: 10 },
        { x: 20, y: 20 },
      ].flat(Infinity),
      // 7
      [
        { x: 44, y: 0 },
        // to enter
        PATH_TO_ENTER,
        // to start position
        { x: 0, y: 20 },
        // to 常足 end
        PATH_BEFORE_TROT_ODD,
        // to 3湾曲 end
        PATH_SERPENTINE3LOOPS,
        // to 分岐 end
        PATH_SEPARETE_CENTER_ODD,
        // to 分裂輪乗り end
        PATH_SEPARETE_CIRCLE_ODD,
        // to 輪乗り end
        PATH_TL_CORNER_CCW,
        GENERATE_ARC(X, 10, 36, Math.PI, -6 * Math.PI),
        // to finish positino
        PATH_TR_CORNER_CCW,
        A,
        { x: 10, y: 10 },
        { x: 10, y: 30 },
      ].flat(Infinity),
    ],
    "speed": [
      // 1
      [
        { t: 0.0, speed: 19.8 },
        { t: 22.696, speed: 6.6 },
        { t: 35.866, speed: 0.0 },

        { t: 44.0, speed: 6.6 },
        { t: 106.408, speed: 13.2 },
        { t: 272.872, speed: 19.8 },
        { t: 315.328, speed: 13.2 },

        { t: 9999.9, speed: 0.0 }, // 番兵
      ],
      // 2
      [
        { t: 0.0, speed: 19.8 },
        { t: 22.696, speed: 6.6 },
        { t: 38.047, speed: 0.0 },

        { t: 44.0 + 2.1818, speed: 6.6 },
        { t: 106.408, speed: 13.2 },
        { t: 239.306, speed: 15.0 }, // ちょっと頑張る
        { t: 275.000, speed: 13.2 },
        { t: 272.872, speed: 19.8 },
        { t: 315.328, speed: 13.2 },

        { t: 9999.9, speed: 0.0 }, // 番兵
      ],
      // 3
      [
        { t: 0.0, speed: 19.8 },
        { t: 22.696, speed: 6.6 },
        { t: 37.660, speed: 0.0 },

        { t: 44.0 + 1.795, speed: 6.6 },
        { t: 106.408, speed: 13.2 },
        { t: 272.872, speed: 19.8 },
        { t: 315.328, speed: 13.2 },

        { t: 9999.9, speed: 0.0 }, // 番兵
      ],
      // 4
      [
        { t: 0.0, speed: 19.8 },
        { t: 22.696, speed: 6.6 },
        { t: 39.842, speed: 0.0 },

        { t: 44.0 + 2.1818 + 1.795, speed: 6.6 },
        { t: 106.408, speed: 13.2 },
        { t: 239.306, speed: 15.0 }, // ちょっと頑張る
        { t: 275.000, speed: 13.2 },
        { t: 272.872, speed: 19.8 },
        { t: 315.328, speed: 13.2 },

        { t: 9999.9, speed: 0.0 }, // 番兵
      ],
      // 5
      [
        { t: 0.0, speed: 19.8 },
        { t: 22.696, speed: 6.6 },
        { t: 39.455, speed: 0.0 },

        { t: 44.0 + 3.590, speed: 6.6 },
        { t: 106.408, speed: 13.2 },
        { t: 272.872, speed: 19.8 },
        { t: 315.328, speed: 13.2 },

        { t: 9999.9, speed: 0.0 }, // 番兵
      ],
      // 6
      [
        { t: 0.0, speed: 19.8 },
        { t: 22.696, speed: 6.6 },
        { t: 41.637, speed: 0.0 },

        { t: 44.0 + 2.1818 + 3.590, speed: 6.6 },
        { t: 106.408, speed: 13.2 },
        { t: 239.306, speed: 15.0 }, // ちょっと頑張る
        { t: 275.000, speed: 13.2 },
        { t: 272.872, speed: 19.8 },
        { t: 315.328, speed: 13.2 },

        { t: 9999.9, speed: 0.0 }, // 番兵
      ],
      // 7
      [
        { t: 0.0, speed: 19.8 },
        { t: 22.696, speed: 6.6 },
        { t: 41.243, speed: 0.0 },

        { t: 44.0 + 5.378, speed: 6.6 },
        { t: 106.408, speed: 13.2 },
        { t: 272.872, speed: 19.8 },
        { t: 315.328, speed: 13.2 },

        { t: 9999.9, speed: 0.0 }, // 番兵
      ],
    ],
  };
})();

