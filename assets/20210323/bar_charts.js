let p;

// div-1
p = [0.2, 0.2, 0.2, 0.2, 0.2];
Plotly.newPlot(
  "div-1",
  [
    {
      x: p,
      y: p.map((_, i) => i),
      marker: { color: p.map((_, i) => GetRGBA(i)) },
      type: "bar",
      orientation: "h",
    },
  ],
  {
    xaxis: { title: "probability", range: [0, Math.max(...p) + 0.05] },
    yaxis: { title: "index", autorange: "reversed" },
  }
);

// div-2
p = [0.3, 0.2, 0.2, 0.2, 0.1];
Plotly.newPlot(
  "div-2",
  [
    {
      x: p,
      y: p.map((_, i) => i),
      marker: { color: p.map((_, i) => GetRGBA(i)) },
      type: "bar",
      orientation: "h",
    },
  ],
  {
    xaxis: { title: "probability", range: [0, Math.max(...p) + 0.05] },
    yaxis: { title: "index", autorange: "reversed" },
  }
);

// div-3
p = [0.3, 0.2, 0.2, 0.2, 0.1];
Plotly.newPlot(
  "div-3",
  GetData([0.2, 0.2, 0.2, 0.2, 0.1], [0, 0, 0, 0, 0.1], [0, 1, 2, 3, 0]),
  {
    xaxis: { title: "probability", range: [0, Math.max(...p) + 0.05] },
    yaxis: { title: "index", autorange: "reversed" },
    barmode: "stack",
    showlegend: false,
  }
);

// div-4
update();

function update() {
  // parse input
  const input = document.getElementById("weights").value;
  let weights;
  try {
    weights = JSON.parse(input);
  } catch (error) {
    document.getElementById("weights").value = "Invalid: " + input;
    return;
  }
  if (
    !Array.isArray(weights) ||
    !weights.length ||
    !weights.every((e) => Math.sign(e) === 1)
  ) {
    document.getElementById("weights").value = "Invalid: " + input;
    return;
  }

  // normalize
  const sum = weights.reduce((acc, cur) => acc + cur);
  const p = weights.map((e) => e / sum);

  // plot
  const tables = GetTables(p);
  Plotly.newPlot("div-4", GetData(...tables[tables.length - 1]), {
    title: { text: "Table structure at each iteration" },
    xaxis: {
      title: "scaled probability",
      range: [0, Math.max(...p) * p.length + 0.1],
    },
    yaxis: { title: "index", autorange: "reversed" },
    barmode: "stack",
    showlegend: false,
    sliders: [
      {
        y: -0.2,
        active: tables.length - 1,
        currentvalue: { prefix: "iteration #" },
        steps: tables.map((_, i) => ({
          label: i,
          value: i,
          method: "animate",
          args: [{ data: GetData(...tables[i]) }],
        })),
      },
    ],
  });
}

function GetData(probOfIndex, probOfAlias, alias) {
  return [
    {
      x: probOfIndex,
      y: alias.map((_, i) => i),
      marker: { color: alias.map((_, i) => GetRGBA(i)) },
      type: "bar",
      orientation: "h",
      name: "probOfIndex",
    },
    {
      x: probOfAlias,
      y: alias.map((_, i) => i),
      marker: { color: alias.map((e) => GetRGBA(e)) },
      type: "bar",
      orientation: "h",
      name: "probOfAlias",
    },
  ];
}
