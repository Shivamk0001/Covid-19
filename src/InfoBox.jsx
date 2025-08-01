import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import "./InfoBox.css";
import classnames from "classnames";

function InfoBox({ title, cases, total, active, isRed, isGreen, isDark, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={classnames("infoBox", {
        "infoBox--selected": active,
        "infoBox--red": isRed,
        "infoBox--green": isGreen,
        "infoBox--dark": isDark,
      })}
    >
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title} 
        </Typography>
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>
        <Typography color="textSecondary" className="infoBox__total">
          {total} <b>Total</b>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
