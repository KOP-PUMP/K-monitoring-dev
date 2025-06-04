import img1 from "/pump_img/36 125X100-400 C34 XXD.png"
import img2 from "/pump_img/CL40959G-133221.png"
import img3 from "/pump_img/ETPL050-050-130 GG 10A200302 B.png"
import img4 from "/pump_img/G1-32SS.png"
import img5 from "/pump_img/JEXM 150.png"
import img6 from "/pump_img/KMX-F-252CSE-5V38AFGABS.png"
import img7 from "/pump_img/KLPH 45316 WC4 21E_Chao.png"
import img8 from "/pump_img/KLPH 45316 WC4 21E_Uni.png"
import img9 from "/pump_img/KOP KDIN 14 50X32-250.png"
import img10 from "/pump_img/RMI-B-F 80-50-160.png"
import img11 from "/pump_img/SRZS 334 US W G11T 62.png"

export type PumpDataType = {
    pump_id: number;
    brand: string;
    name: string;
    full_name: string;
    company_code: string;
    pump_type: string;
    image: string;
    province: string;
    sales_area: string;
    status: string;
};

export const pumpData = [
    {
        pump_id: 1,
        brand:"KOP",
        name:"KMX-F-252CSE-5V38AFGABS",
        full_name:"KOP KMX-F-252CSE-5V38AFGABS",
        company_code:"P-0244",
        pump_type:"KOP Standard end suction centrifulgal closed cloupling pump",
        image: img6,
        province: "กรุงเทพมหานคร - Bangkok",
        sales_area: "ภาคกลาง - Central",     
        status: "Good"
    },
    {
        pump_id: 2,
        brand:"KOP",
        name:"KDIN 14 50X32-250",
        full_name:"KOP KDIN 14 50X32-250",
        company_code:"T-0226",
        pump_type:"KOP Standard end suction centrifulgal pump",
        image: img9,
        province: "นครศรีธรรมราช - Nakhon Si Thammarat",
        sales_area: "ภาคใต้ - Southern", 
        status: "Good"
    },
    {
        pump_id: 3,
        brand:"KOP",
        name:"KLPH 45316 WC4 21E",
        full_name:"KOP KLPH 45316 WC4 21E",
        company_code:"U-0010",
        pump_type:"KOP Liquid ring vacuum pump",
        image: img8,
        province: "กรุงเทพมหานคร - Bangkok",
        sales_area: "ภาคกลาง - Central",  
        status: "Good"
    },
    {
        pump_id: 4,
        brand:"KOP",
        name:"KLPH 45316 WC4 21E",
        full_name:"KOP KLPH 45316 WC4 21E",
        company_code:"C-0081 X",
        pump_type:"KOP Liquid ring vacuum pump",
        image: img7,
        province: "กรุงเทพมหานคร - Bangkok",
        sales_area: "ภาคกลาง - Central", 
        status: "Good"
    },
    {
        pump_id: 5,
        brand:"EBARA",
        name:"JEXM 150",
        full_name:"EBARA JEXM 150",
        company_code:"K-0002 X",
        pump_type:"EBARA Closed Coupling",
        image: img5,
        province: "กรุงเทพมหานคร - Bangkok",
        sales_area: "ภาคกลาง - Central", 
        status: "Good"
    },
    {
        pump_id: 6,
        brand:"KSB",
        name:"ETPL050-050-130 GG 10A200302 B",
        full_name:"KSB ETPL050-050-130 GG 10A200302 B",
        company_code:"B-0081",
        pump_type:"KSB self-priming pump",
        image: img3,
        province: "พระนครศรีอยุธยา - Phra Nakhon Si Ayutthaya",
        sales_area: "ภาคกลาง - Central", 
        status: "Good"
    },
    {
        pump_id: 7,
        brand:"KOP",
        name:"KCR 32-160 65",
        full_name:"KOP KCR 32-160 65",
        company_code:"S-0298 X",
        pump_type:"KOP vertical multistage pump",
        image: img6,
        province: "กรุงเทพมหานคร - Bangkok",
        sales_area: "ภาคกลาง - Central", 
        status: "Good"
    },
    {
        pump_id: 8,
        brand:"SERO",
        name:"SRZS 334 US W G11T 62",
        full_name:"SERO SRZS 334 US W G11T 62",
        company_code:"A-0366",
        pump_type:"SERO Side Channel Pump",
        image: img11,
        province: "กรุงเทพมหานคร - Bangkok",
        sales_area: "ภาคกลาง - Central", 
        status: "Good"
    },
    {
        pump_id: 9,
        brand:"Richter",
        name:"RMI-B-F 80-50-160",
        full_name:"Richter RMI-B-F 80-50-160",
        company_code:"V-0010 X",
        pump_type:"Lining end suction pump",
        image: img10,
        province: "กรุงเทพมหานคร - Bangkok",
        sales_area: "ภาคกลาง - Central", 
        status: "Good"
    },
    {
        pump_id: 10,
        brand:"KOP",
        name:"36 125X100-400 C34 XXD",
        full_name:"KISO 36 125X100-400 C34 XXD",
        company_code:"T-0006",
        pump_type:"KOP Standard end suction centrifulgal pump",
        image: img1,
        province: "ระยอง - Rayong",
        sales_area: "ภาคตะวันออก - Eastern", 
        status: "Good"
    },
    {
        pump_id: 11,
        brand:"Grundfos",
        name:"CL40959G-133221",
        full_name:"CL40959G-133221",
        company_code:"P-0009 X",
        pump_type:"Grundfos Centrifugal Pump",
        image: img2,
        province: "กรุงเทพมหานคร - Bangkok",
        sales_area: "ภาคกลาง - Central", 
        status: "Good"
    },
    {
        pump_id: 12,
        brand:"Blackmer",
        name:"G1-32SS",
        full_name:"Blackmer G1-32SS",
        company_code:"M-0047 X",
        pump_type:"Blackmer internal gear pump",
        image: img4,
        province: "กรุงเทพมหานคร - Bangkok",
        sales_area: "ภาคกลาง - Central", 
        status: "Good"
    }
]