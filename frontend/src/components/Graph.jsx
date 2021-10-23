import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const { playerName } = useParams();
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
      await axios(`/api/matches/${playerName}/${10}`).then((data) => {
        setGraphData(data.data.graphData);
        setComments(data.data.comments);
      });
    }
  }, [playerName]);

  return (
    <div className="bg-gray-800 min-h-screen">
      {graphData && (
        <>
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
