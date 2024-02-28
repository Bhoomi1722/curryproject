import React, { useEffect, useState } from "react";
import "./BMI.css";
import axios from "axios";
import ReactConfetti from 'react-confetti'

function BMI() {
  const [bmiCategory, setBmiCategory] = useState("");
  const [username, setUsername] = useState("");
  const [diet, setDiet] = useState(false);
  const [compare, setCompare] = useState(false);
  const [bmi, setBmi] = useState(0);
  const [newBmi, setNewBmi] = useState(0);
  const [statement, setStatement] = useState("");
  const [btn,setBtn] = useState(false)
  var category = "";
  const [windowDimension,setWindowDimension] = useState({width:window.innerWidth,height:window.innerHeight})
  const detectSize = ()=> {
    setWindowDimension({width:window.innerWidth,height:window.innerHeight})
  }
  useEffect(()=>{
    window.addEventListener("resize",detectSize);
    return ()=>{
        window.removeEventListener("resize",detectSize)
    }
  })
  const handleOnSubmit = () => {
    var username = document.getElementById("name").value;
    var height = document.getElementById("height").value;
    var weight = document.getElementById("weight").value;
    var email = document.getElementById("email").value;
    var age = document.getElementById("age").value;
    var selectedValue = document.querySelector(
      'input[name="radio"]:checked'
    ).id;
    var heightM = height * 0.3048;

    var bmi = weight / (((height / 100) * height) / 100);
    setNewBmi(bmi);

    if (bmi < 18.5) {
      category = "Underweight";
      setBmiCategory("Underweight");
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "Normal weight";
      setBmiCategory("Normal weight");
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight";
      setBmiCategory("Overweight");
    } else {
      category = "Obesity";
      setBmiCategory("Obesity");
    }

    let url = "http://localhost:8081/store";

    let data = {
      username: username,
      bmi: bmi,
      email: email,
      height: height,
      weight: weight,
      age: age,
      gender: selectedValue,
      compareStatement: "",
      newBMI: 0,
    };
    axios.post(url, data).then((res) => {
      console.log(res);
      setBmi(res.data.bmi);
      setUsername(res.data.username);
      setStatement(res.data.compareStatement);
      document.getElementById("ptag").innerHTML =
        `Hi ${res.data.username}, Your body mass index is ` +
        `${bmi.toFixed(2)}` +
        `(` +
        `${category}` +
        `)`;
    });
  };
  const compareBMI = () => {
    setCompare(true);
    setDiet(false);
    if (compare) {
      const divElement = document.querySelector(".compare__diet");
      setCompare(true);
      if (bmi === 0) {
        const p = document.createElement("p");
        p.textContent =
          "Hey you are a new user, do follow your customized diet and you can see the diet plan as per your bmi category by clicking on generate button";
        divElement.innerHTML = p.innerHTML;
      } else {
        const p = document.createElement("p");
        console.log(statement);
        if (statement === "Maintained") {
          p.textContent = `Welcome back Mr. ${username}, Your previous bmi is ${bmi.toFixed(
            2
          )} and current bmi is ${newBmi.toFixed(
            2
          )} and you have maintained your diet`;
        }else if(statement === "Improved") {
            setBtn(true)
            console.log(btn)
            p.textContent = `Welcome back Mr. ${username}, Your previous bmi is ${bmi.toFixed(
              2
            )} and current bmi is ${newBmi.toFixed(2)} and congratulations you have improved your bmi`;
        } else {
            p.textContent = `Welcome back Mr. ${username}, Your previous bmi is ${bmi.toFixed(
                2
              )} and current bmi is ${newBmi.toFixed(2)} and sorry to inform you that your bmi has been decerrased follow the customized diet`;
        }
        divElement.innerHTML = p.innerHTML;
      }
    }
  };
  const generateDiet = () => {
    setBtn(false)
    setDiet(true);
    setCompare(false);
    console.log(diet);
    var customized_diet = {
      Underweight: {
        diet: "To achieve a healthy weight gain, focus on increasing calorie intake with nutrient-dense foods. Include a balance of carbohydrates, proteins, and healthy fats in your meals. Aim for regular, smaller meals throughout the day.",
        example_foods: [
          "Whole grains (brown rice, quinoa)",
          "Lean proteins (chicken, fish, tofu)",
          "Healthy fats (avocado, nuts, olive oil)",
          "Dairy or dairy alternatives (milk, yogurt)",
        ],
        tips: [
          "Snack on nuts and seeds for extra calories and healthy fats.",
          "Add avocado or olive oil to salads and sandwiches.",
          "Include protein-rich snacks like Greek yogurt or hummus with vegetables.",
        ],
      },
      "Normal weight": {
        diet: "Maintain your weight by eating a balanced diet that includes a variety of nutrient-rich foods. Focus on portion control and incorporating fruits, vegetables, lean proteins, whole grains, and healthy fats into your meals.",
        example_foods: [
          "Colorful fruits and vegetables",
          "Lean proteins (chicken, turkey, fish)",
          "Whole grains (quinoa, whole wheat pasta)",
          "Healthy fats (avocado, nuts, seeds)",
        ],
        tips: [
          "Watch portion sizes to prevent weight gain.",
          "Fill half your plate with vegetables at each meal.",
          "Choose whole grains over refined grains for added fiber and nutrients.",
        ],
      },
      Overweight: {
        diet: "Focus on a balanced diet with portion control and increased physical activity to achieve weight loss. Incorporate more fruits, vegetables, lean proteins, and whole grains while reducing intake of high-calorie and processed foods.",
        example_foods: [
          "Non-starchy vegetables (leafy greens, broccoli)",
          "Lean proteins (chicken breast, tofu)",
          "Whole grains (brown rice, quinoa)",
          "Healthy fats (avocado, olive oil)",
        ],
        tips: [
          "Limit intake of sugary beverages and processed snacks.",
          "Choose baked or grilled foods over fried options.",
          "Stay hydrated by drinking water throughout the day.",
        ],
      },
      Obesity: {
        diet: "Focus on a calorie-controlled diet with an emphasis on whole, nutrient-dense foods to promote weight loss. Incorporate plenty of vegetables, lean proteins, whole grains, and healthy fats while limiting intake of sugary and high-fat foods.",
        example_foods: [
          "Leafy greens and colorful vegetables",
          "Lean proteins (chicken, fish, beans)",
          "Whole grains (quinoa, barley)",
          "Healthy fats (avocado, nuts, seeds)",
        ],
        tips: [
          "Track your calorie intake and aim for a modest deficit for gradual weight loss.",
          "Include regular physical activity to support weight loss efforts.",
          "Choose low-calorie, nutrient-dense snacks like fresh fruit or raw vegetables.",
        ],
      },
    };
    if (diet) {
      var tbody = document.querySelector("#customDietTable tbody");

      // Generate table rows based on the BMI category
      var dietInfo = customized_diet[bmiCategory];
      console.log(bmiCategory);
      if (dietInfo) {
        tbody.innerHTML = generateTableRows(bmiCategory, dietInfo);
      } else {
        tbody.innerHTML =
          "<tr><td colspan='4'>No diet information available for the selected BMI category.</td></tr>";
      }
    }
  };
  function generateTableRows(category, dietInfo) {
    var row = "<tr>";
    row += "<td>" + category + "</td>";
    row += "<td>" + dietInfo.diet + "</td>";
    row += "<td><ul>";
    dietInfo.example_foods.forEach(function (food) {
      row += "<li>" + food + "</li>";
    });
    row += "</ul></td>";
    row += "<td><ul>";
    dietInfo.tips.forEach(function (tip) {
      row += "<li>" + tip + "</li>";
    });
    row += "</ul></td>";
    row += "</tr>";
    return row;
  }
  return (
    <div>
      <h3>
        <b>B</b>ody <b>M</b>ass <b>I</b>ndex Calculator
      </h3>
      <form class="form" id="form">
        <input
          type="text"
          class="text-inputt"
          id="name"
          placeholder="Enter Your name"
          autocomplete="off"
          required
        />
        <input
          type="text"
          class="text-inputt"
          id="email"
          placeholder="Enter Your Email ID"
          autocomplete="off"
          required
        />

        <div class="row-one">
          <input
            type="text"
            class="text-input"
            id="age"
            autocomplete="off"
            required
          />
          <p class="text">Age</p>
          <label class="container">
            <input type="radio" name="radio" id="f" />
            <p class="text">Female</p>
            <span class="checkmark"></span>
          </label>
          <label class="container">
            <input type="radio" name="radio" id="m" />
            <p class="text">Male</p>
            <span class="checkmark"></span>
          </label>
        </div>

        <div class="row-two">
          <input
            type="text"
            class="text-input"
            id="height"
            autocomplete="off"
            required
          />
          <p class="text">Height (cm)</p>
          <input
            type="text"
            class="text-input"
            id="weight"
            autocomplete="off"
            required
          />
          <p class="text">Weight (kg)</p>
        </div>
        <div class="row-two">
          <p id="errorContainer"></p>
        </div>
        <button type="button" id="submit" onClick={handleOnSubmit}>
          Submit
        </button>
      </form>
      <div class="results">
        <p id="ptag"></p>
      </div>
      <div class="buttons">
        <div class="customized__diet">
          <button class="custom__diet" onClick={generateDiet}>
            Generate Customized Diet Plan
          </button>
        </div>
        <div class="compare">
          <button class="compare__previous" onClick={compareBMI}>
            Compare your last visit
          </button>
        </div>
      </div>
      {diet && (
        <table id="customDietTable" class="table table-striped">
          <thead>
            <tr>
              <th>BMI Category</th>
              <th>Diet</th>
              <th>Example Foods</th>
              <th>Tips</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      )}
      {compare && <div className="compare__diet"></div>}
      {btn && <ReactConfetti width={windowDimension.width} height={windowDimension.height} tweenDuration={1000}/>}
    </div>
  );
}

export default BMI;
