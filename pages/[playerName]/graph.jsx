import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const Graph = () => {
  const [graphData, setGraphData] = useState();
  const [comments, setComments] = useState();
  const [limit, setLimit] = useState(10);
  const router = useRouter();
  const { playerName } = router.query;

  const onSubmit = (data) => {
    setLimit(data.target.value);
  };
  const colors = [
    "#9ebdeb",
    "#91ddb0",
    "#38a4e9",
    "#4ee4a9",
    "#236a9c",
    "#1a427a",
    "#5855a1",
    "#539359",
    "#046b0d",
    "#394b63",
    "#636864",
    "#c5d4cf",
  ];

  useEffect(async () => {
    if (playerName) {
      await axios(
        `http://localhost:3000/api/players/${playerName}/${limit}`
      ).then((data) => {
        setGraphData(data.data.graphData);
        setComments(data.data.comments);
      });
    }
  }, [playerName, limit]);

  return (
    <div className="bg-gray-800 min-h-screen">
      {graphData && (
        <>
          <select className="m-3" onChange={onSubmit} defaultValue={10}>
            <option value={5}>Last 5 Matches</option>
            <option value={10}>Last 10 Matches</option>
            <option value={25}>Last 25 Matches</option>
            <option value={50}>Last 50 Matches</option>
            <option value={100}>Last 100 Matches</option>
            <option value={"all"}>All Matches</option>
          </select>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie dataKey="value" data={graphData} stroke="">
                {graphData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="value">
                {graphData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Bar>
              <XAxis dataKey="name" tick={{ fill: "#6EE7B7" }} />
              <YAxis allowDecimals={false} tick={{ fill: "#6EE7B7" }} />
              <Tooltip cursor={false} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
      <div>
        <span className="text-3xl text-green-300 font-bold m-10">Comments</span>
        {comments && (
          <ul className="list-disc text-green-300 ml-14 mt-2">
            {comments.map((comment, i) => (
              <li key={i}>{comment}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Graph;
