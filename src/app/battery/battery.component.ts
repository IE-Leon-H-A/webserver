import {Component, OnInit} from '@angular/core';
import {SharedService} from '../_services/shared.service';


@Component({
  selector: 'app-battery',
  templateUrl: './battery.component.html'
})
export class BatteryComponent implements OnInit {

  constructor(
    private sharedService: SharedService,
  ) {
  }

  ngOnInit(): void {
    this.generateTable();
    this.batteryResponse();
    this.batteryRequest();
  }

  batteryRequest() {
    // console.log("requesting data")
    setTimeout( ()  => {
      this.sharedService.sock.emit("battery_request");
      this.batteryRequest();
    }, 1000);
  }

  batteryResponse() {
    this.sharedService.sock.on('battery_response', (data: any) => {

      let data_obj = JSON.parse(data);
      // console.log("socketio event @" + String(Date.now()));

      Object.keys(data_obj).forEach(function (key) {
        let cell_box = document.getElementById(key);
        let value = parseInt(data_obj[key]) / 1000;

        if (value === -0.001) {
          cell_box!.innerHTML = String("N/A")
        } else {
          cell_box!.innerHTML = String(value)
        }

        if (Number(key) <= 320) {
          // Coloring based on UV/OV voltage thresholds
          if (value === -0.001) {
            cell_box!.style.backgroundColor = "#ffffff";
          } else if (value >= Number((document.getElementById("ov_threshold") as HTMLInputElement).value)) {
            cell_box!.style.backgroundColor = "#ff9999";
          } else if (value <= Number((document.getElementById("uv_threshold") as HTMLInputElement).value)) {
            cell_box!.style.backgroundColor = "#cceeff";
          } else {
            cell_box!.style.backgroundColor = "#ffffff";
          }
        }
      });

    })
  }

  generateTable() {
    document.getElementById("main")!.style.fontSize = "11px";
    document.getElementById("main")!.style.textAlign = "center";
    document.getElementById("thresholds")!.style.padding = "10px";
    document.getElementById("alerts")!.style.width = "70%";
    document.getElementById("alerts")!.style.textAlign = "center";
    document.getElementById("alerts")!.style.paddingTop = "10px";
    document.getElementById("alerts")!.style.margin = "auto";
    document.getElementById("table-container")!.style.margin = "auto";
    document.getElementById("table-container")!.style.width = "98%";

    let table = document.createElement("table");

    table.style.tableLayout = "fixed";
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";
    table.style.height = "100%";

    let idCount = 320;
    let tempCount = 366;
    for (let i = 0; i < 20; i++) {
      const row = document.createElement("tr");

      row.style.width = "100%";
      row.style.borderWidth = "1px";
      row.style.borderStyle = "solid";
      row.style.borderColor = "black";

      if (i % 2 !== 0) {
        for (let j = 0; j < 32; j++) {
          const cell = document.createElement("td");

          cell.style.borderWidth = "1px";
          cell.style.borderStyle = "solid";
          cell.style.borderColor = "black";

          cell.className = "voltage_cells";
          const cell_number_div = document.createElement("div");
          const voltage_value_div = document.createElement("div");
          cell_number_div.id = "string_position_" + String(idCount);
          cell_number_div.innerHTML = "#" + idCount;
          voltage_value_div.id = String(idCount);
          voltage_value_div.innerHTML = "N/A";
          cell.appendChild(cell_number_div);
          cell.appendChild(voltage_value_div);
          row.appendChild(cell);
          idCount--;
        }
      } else {
        for (let j = 0; j < 3; j++) {
          const temp = document.createElement("td");

          temp.style.borderWidth = "1px";
          temp.style.borderStyle = "solid";
          temp.style.borderColor = "black";

          temp.setAttribute("colSpan", "10");
          temp.className = "temp_cells";
          const temp_number_div = document.createElement("div");
          const temp_value_div = document.createElement("div");
          temp_number_div.id = "temp_position_" + String(idCount);
          temp_number_div.innerHTML = "T" + String(tempCount - 336);
          temp_value_div.id = String(tempCount);
          temp_value_div.innerHTML = "N/A";
          temp.appendChild(temp_number_div);
          temp.appendChild(temp_value_div);
          row.appendChild(temp);
          tempCount--;
        }
      }
      table.appendChild(row);
    }
    document.getElementById("table-container")!.appendChild(table);

    (document.getElementById("ov_threshold") as HTMLInputElement)!.value = String(3.4);
    (document.getElementById("uv_threshold")as HTMLInputElement)!.value = String(3.1)
  }
}
