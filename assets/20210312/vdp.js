Plotly.newPlot("vdp", vdp(0.5), {
  title: { text: "Van der Pol oscillator" },
  sliders: [
    {
      active: 5,
      currentvalue: { prefix: "mu = " },
      steps: Array(50)
        .fill()
        .map((_, i) => ({
          label: i / 10,
          value: i / 10,
          method: "animate",
          args: [
            { data: vdp(i / 10) },
            {
              transition: { duration: 0 },
              frame: { duration: 0, redraw: false },
            },
          ],
        })),
    },
  ],
});

function vdp(mu) {
  ode = (t, y) => [y[1], mu * (1 - y[0] * y[0]) * y[1] - y[0]];
  y0 = [0.01, 0];
  tSpan = [0, 50];
  [t, y] = rungeKutta(ode, y0, tSpan);
  return [{ x: t, y: y.map((e) => e[0]) }];
}
