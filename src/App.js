import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [menuName, setMenuName] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [image, setImage] = useState(null);
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMenus = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:5000/menus");
      setMenuList(response.data);
    } catch (error) {
      console.error("Error fetching menus:", error);
      setError("ไม่สามารถดึงข้อมูลเมนูได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!menuName || !price || !cost) {
      alert("กรุณากรอกข้อมูลชื่อเมนู ราคา และต้นทุนให้ครบถ้วน");
      return;
    }

    if (image && !["image/jpeg", "image/png"].includes(image.type)) {
      alert("กรุณาเลือกไฟล์รูปภาพที่เป็น JPEG หรือ PNG เท่านั้น");
      return;
    }

    const formData = new FormData();
    formData.append("name", menuName);
    formData.append("price", price);
    formData.append("cost", cost);
    if (image) {
      formData.append("image", image);
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/add-menu", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.message);
      handleCancel();
      fetchMenus();
    } catch (error) {
      console.error("Error saving menu:", error);
      setError("ไม่สามารถบันทึกเมนูได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setMenuName("");
    setPrice("");
    setCost("");
    setImage(null);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <ul>
          <li>ข้อมูลคำสั่งซื้อ</li>
          <li className="active">ข้อมูลเมนู</li>
          <li>สถานะของหุ่นยนต์</li>
          <li>เมนูที่ขายไปวันนี้</li>
          <li>รายการยอดขาย</li>
        </ul>
      </aside>

      <main className="main-content">
        <button className="back-button">ย้อนกลับ</button>
        <div className="form-container">
          <div className="form-group">
            <label>ชื่อเมนู:</label>
            <input
              type="text"
              placeholder="กรอกชื่อเมนู"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>ราคา:</label>
            <input
              type="number"
              placeholder="กรอกราคา"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>ค่าต้นทุน:</label>
            <input
              type="number"
              placeholder="กรอกค่าต้นทุน"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>อัพโหลดรูปภาพ:</label>
            <input type="file" onChange={handleImageChange} />
          </div>
          <div className="button-group">
            <button className="cancel-button" onClick={handleCancel}>
              ยกเลิก
            </button>
            <button className="save-button" onClick={handleSave}>
              บันทึก
            </button>
          </div>
        </div>
        {loading && <p>กำลังโหลดข้อมูล...</p>}
        {error && <p className="error">{error}</p>}
        <div className="menu-list">
          <h2>รายการเมนู</h2>
          {menuList.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>ชื่อเมนู</th>
                  <th>ราคา</th>
                  <th>ต้นทุน</th>
                  <th>รูปภาพ</th>
                </tr>
              </thead>
              <tbody>
                {menuList.map((menu, index) => (
                  <tr key={menu.id}>
                    <td>{index + 1}</td>
                    <td>{menu.name}</td>
                    <td>{menu.price} บาท</td>
                    <td>{menu.cost} บาท</td>
                    <td>
                      {menu.image ? (
                        <img
                          src={`http://localhost:5000${menu.image}`}
                          alt={menu.name}
                          width={100}
                        />
                      ) : (
                        "ไม่มีรูป"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>ยังไม่มีเมนูในระบบ</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
