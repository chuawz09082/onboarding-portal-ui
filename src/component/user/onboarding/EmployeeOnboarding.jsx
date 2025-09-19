import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../../App.css";
import API from "../../../lib/http";
import {
  getLocalEmailFallback,
  getToken,
  getUsername,
  isHR,
  parseJwt,
} from "../../../lib/jwt";
import { logout } from "../../../redux/store/authSlice";

const emailRegex = /^\S+@\S+\.\S+$/;

function colorFromString(s = "") {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  const palette = [
    "#7c4dff",
    "#00bcd4",
    "#ff7043",
    "#26a69a",
    "#42a5f5",
    "#ab47bc",
  ];
  return palette[Math.abs(h) % palette.length];
}
function makeInitials(nameLike = "U") {
  const parts = String(nameLike).trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0] ? parts[0][0].toUpperCase() : "U";
}
function makeDefaultAvatarDataUrl(seedText, labelText = "") {
  const bg = colorFromString(seedText);
  const initials = makeInitials(labelText || seedText);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">
      <defs><clipPath id="r"><rect rx="48" ry="48" width="96" height="96"/></clipPath></defs>
      <g clip-path="url(#r)">
        <rect width="96" height="96" fill="${bg}"/>
        <text x="50%" y="54%" text-anchor="middle"
              font-family="system-ui,-apple-system,Segoe UI,Roboto,Arial"
              font-size="42" fill="#fff" dominant-baseline="middle">${initials}</text>
      </g>
    </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function EmployeeOnboarding() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const username = getUsername();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    preferredName: "",
    address: "",
    cellPhone: "",
    workPhone: "",
    email: "",
    ssn: "",
    dob: "",
    gender: "",
    citizenOrPr: "",
    workAuth: "",
    workAuthOther: "",
    workAuthStart: "",
    workAuthEnd: "",
    hasDL: "NO",
    dlNumber: "",
    dlExpire: "",
    avatarUrl: "",
    reference: {
      firstName: "",
      lastName: "",
      middleName: "",
      phone: "",
      address: "",
      email: "",
      relationship: "",
    },
    emergency1: {
      firstName: "",
      lastName: "",
      middleName: "",
      phone: "",
      email: "",
      relationship: "",
    },
  });

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [workAuthFile, setWorkAuthFile] = useState(null);
  const [dlFile, setDlFile] = useState(null);

  const [userId, setUserId] = useState("");

  const isCitizenOrPR = useMemo(
    () => form.citizenOrPr === "CITIZEN" || form.citizenOrPr === "GREENCARD",
    [form.citizenOrPr]
  );
  const needsWorkAuth = useMemo(
    () => form.citizenOrPr === "NO",
    [form.citizenOrPr]
  );

  const defaultAvatar = useMemo(() => {
    const seed = (form.email || username || "user").toString();
    const label =
      [form.firstName, form.lastName].filter(Boolean).join(" ") || seed;
    return makeDefaultAvatarDataUrl(seed, label);
  }, [form.email, username, form.firstName, form.lastName]);

  function doLogout() {
    dispatch(logout());
    nav("/login", { replace: true });
  }

  //let userId = "";
  // ---- Fetch email from DB first, then userinfo, then local fallback ----
  useEffect(() => {
    const access = getToken();
    if (!access) {
      nav("/login", { replace: true });
      return;
    }
    try {
      if (isHR(access)) {
        nav("/hr/onboarding", { replace: true });
        return;
      }
    } catch {}
    setUserId((parseJwt(access)?.sub || "").toString());
    //userId = (parseJwt(access)?.sub || "").toString();
    //console.log(`userid: ${userId}`);
    (async () => {
      let resolved = "";

      // 1) Your application service (database-backed)
      try {
        const raw = String(t).trim().replace(/^"|"$/g, "");
        const token = /^Bearer\s/i.test(raw) ? raw : `Bearer ${raw}`;

        const r = await API.get("http://localhost:9000/application-service/api/onboarding/me", {
          validateStatus: () => true,
          headers: {
            Authorization: token,
            Accept: "application/json",
          },
        });
        if (
          r.status === 200 &&
          r.data &&
          r.data.email &&
          emailRegex.test(r.data.email)
        ) {
          resolved = r.data.email.trim();
          setForm((f) => ({
            ...f,
            email: resolved,
            avatarUrl: r.data.avatarUrl || f.avatarUrl,
          }));
        }
      } catch (e) {
        // console.debug('onboarding/me error', e);
      }

      // 2) OIDC userinfo (configure your gateway to proxy this)
      // For Spring Security: /oauth2/userinfo; for Keycloak: /realms/<realm>/protocol/openid-connect/userinfo (proxy it)
      if (!resolved) {
        try {
          const r = await API.get("/oauth2/userinfo", {
            validateStatus: () => true,
          });
          const uinfoEmail =
            r?.data?.email || r?.data?.preferred_username || r?.data?.upn;
          if (r.status === 200 && uinfoEmail && emailRegex.test(uinfoEmail)) {
            resolved = String(uinfoEmail).trim();
            setForm((f) => ({ ...f, email: resolved }));
          }
        } catch {}
      }

      // 3) Strictly local fallback (tokens / localStorage). This keeps the UI usable in dev.
      if (!resolved) {
        const local = getLocalEmailFallback();
        if (local) setForm((f) => ({ ...f, email: local }));
      }
    })();
  }, [nav]);

  // Clean up object URLs
  useEffect(
    () => () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    },
    [avatarPreview]
  );

  // helpers
  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }
  function setNested(path, value) {
    setForm((f) => {
      const copy = { ...f };
      const segs = path.split(".");
      let obj = copy;
      for (let i = 0; i < segs.length - 1; i++)
        obj = obj[segs[i]] = { ...obj[segs[i]] };
      obj[segs[segs.length - 1]] = value;
      return copy;
    });
  }

  const phoneOk = (p) => p && p.replace(/\D/g, "").length >= 10;

  function validate() {
    if (!form.firstName.trim()) return "First name is required";
    if (!form.lastName.trim()) return "Last name is required";
    if (!form.email.trim()) return "Email is required";
    if (!emailRegex.test(form.email)) return "Email looks invalid";
    if (!form.cellPhone.trim()) return "Cell phone is required";
    if (!phoneOk(form.cellPhone)) return "Cell phone looks invalid";
    if (!form.dob) return "Date of birth is required";
    if (!form.gender) return "Please select gender";

    if (needsWorkAuth) {
      if (!form.workAuth) return "Select a work authorization type";
      if (form.workAuth === "OTHER" && !form.workAuthOther.trim())
        return "Specify work authorization";
      if (!form.workAuthStart) return "Work authorization start date required";
      if (!form.workAuthEnd) return "Work authorization end date required";

      if (!workAuthFile) return "Upload your work authorization document";
    }

    if (form.hasDL === "YES") {
      if (!form.dlNumber) return "Driver’s license number required";
      if (!form.dlExpire) return "Driver’s license expiration date required";
      if (!dlFile) return "Please upload a copy of your driver’s license";
    }

    if (
      !form.emergency1.firstName.trim() ||
      !form.emergency1.lastName.trim() ||
      !form.emergency1.phone.trim()
    )
      return "Emergency contact (first/last/phone) is required";
    return "";
  }

  async function saveDraft(e) {
    e.preventDefault();

    setErr("");
    setOk("");
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }

    try {
      setBusy(true);
      const payload = { ...form };
      console.log(`userid: ${userId}`);

      payload.userId = userId;
      payload.employeeId = userId;
      payload.visaStatus = [
        {
          visaType: form.citizenOrPr ? form.citizenOrPr : form.workAuth,
          activeFlag: true,
          startDate: form.isCitizenOrPR ? null : form.workAuthStart,
          endDate: form.isCitizenOrPR ? null : form.workAuthEnd,
        },
      ];
      payload.address = [{ addressLine1: form.address }];
      payload.alternatePhone = form.workPhone;
      payload.driverLicense = payload.dlNumber;
      payload.driverLicenseExpiration = payload.dlExpire;
      payload.contact = [
        {
          firstName: form.emergency1.firstName,
          lastName: form.emergency1.lastName,
          cellPhone: form.emergency1.phone,
          alternatePhone: form.emergency1.workPhone,
          email: form.emergency1.email,
          relationship: form.emergency1.relationship,
          type: "EMERGENCY",
        },
      ];
      try {
        if (Object.keys(payload).length > 0) {
          const payloadResponse = await axios.post(
            "http://localhost:9000/employee-service/api/v1/employees",
            payload,
            {
              headers: {
                "Content-Type": "application/json",
              },
              validateStatus: () => true,
            }
          );
          const accessToken = getToken();
          const raw = String(accessToken).trim().replace(/^"|"$/g, "");
          const token = /^Bearer\s/i.test(raw) ? raw : `Bearer ${raw}`;
          const onboardingUpdateResponse = await axios.put(
            "http://localhost:9000/application-service/api/onboarding/me/profile",
            { comment: "Profile completed" },
            {
              headers: {
                Authorization: token,
                Accept: "application/json",
              },
              validateStatus: () => true,
            }
          );
          const fileUploadResults = await uploadAllFiles(
            payloadResponse.data.data.userId
          );
          nav("/application", { replace: true });
        }
      } catch (error) {
        console.error(error);
      }
    } catch (err) {
      console.log("error", err);
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }
  const uploadSingleFile = async (file, fileType, comment = "", employeeId) => {
    const fd = new FormData();
    fd.append("file", file); // Backend expects "file" parameter
    fd.append("type", fileType); // Backend expects "type" parameter

    if (comment) {
      fd.append("comment", comment); // Optional "comment" parameter
    }
    try {
      const accessToken = getToken();
      const raw = String(accessToken).trim().replace(/^"|"$/g, "");
      const token = /^Bearer\s/i.test(raw) ? raw : `Bearer ${raw}`;
      const response = await axios.post(
        `http://localhost:8085/api/visa/employee/${employeeId}/upload`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
          validateStatus: () => true,
        }
      );

      console.log(`${fileType} upload response:`, response);
    } catch (error) {
      console.error(`${fileType} upload error:`, error);
      throw error;
    }
  };

  const uploadAllFiles = async (employeeId) => {
    const results = [];

    // Determine appropriate types for each file (check with backend team for exact values)
    if (dlFile) {
      results.push(
        await uploadSingleFile(
          dlFile,
          "driving_license",
          "Driver's license document",
          employeeId
        )
      );
    }
    if (avatarFile) {
      results.push(
        await uploadSingleFile(
          avatarFile,
          "avatar",
          "Profile picture",
          employeeId
        )
      );
    }
    if (workAuthFile) {
      results.push(
        await uploadSingleFile(
          workAuthFile,
          "work_authorization",
          "Work authorization document",
          employeeId
        )
      );
    }
    return results;
  };

  const labelStyle = { fontSize: 12, color: "#666", margin: "0 0 4px 2px" };
  const hintStyle = { fontSize: 11, color: "#9aa0a6", marginTop: 4 };

  return (
    <div className="auth-layout">
      <form onSubmit={saveDraft} className="auth-card" noValidate>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.1 }}>
            Onboarding Application
          </h1>
          <button
            type="button"
            className="auth-button"
            onClick={doLogout}
            style={{ width: "auto", padding: "8px 12px" }}
          >
            Logout
          </button>
        </div>
        <p style={{ color: "#666", marginTop: 0 }}>
          Welcome, <strong>{username || "user"}</strong>. Fields marked with{" "}
          <strong>*</strong> are required.
        </p>

        {/* Avatar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "8px 0 16px",
          }}
        >
          <img
            src={avatarPreview || form.avatarUrl || defaultAvatar}
            alt="Avatar"
            width={72}
            height={72}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid #e0e0e0",
            }}
          />
          <div>
            <label
              className="auth-button"
              style={{
                display: "inline-block",
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              Upload Avatar
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (!file) return;
                  setAvatarFile(file);
                  const url = URL.createObjectURL(file);
                  if (avatarPreview) URL.revokeObjectURL(avatarPreview);
                  setAvatarPreview(url);
                  setForm((f) => ({ ...f, avatarUrl: "" }));
                }}
              />
            </label>
            <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
              If you don’t upload a photo, we’ll use a default avatar.
            </div>
          </div>
        </div>
        <h3 style={{ margin: "16px 0 8px" }}>Personal Information</h3>
        {/* Basic Info */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          <input
            className="auth-input"
            placeholder="First Name *"
            value={form.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Last Name *"
            value={form.lastName}
            onChange={(e) => setField("lastName", e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Middle Name"
            value={form.middleName}
            onChange={(e) => setField("middleName", e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Preferred Name"
            value={form.preferredName}
            onChange={(e) => setField("preferredName", e.target.value)}
          />
        </div>

        <input
          className="auth-input"
          placeholder="Current Address"
          value={form.address}
          onChange={(e) => setField("address", e.target.value)}
        />

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          <input
            className="auth-input"
            placeholder="Cell Phone *"
            value={form.cellPhone}
            onChange={(e) => setField("cellPhone", e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Work Phone"
            value={form.workPhone}
            onChange={(e) => setField("workPhone", e.target.value)}
          />
        </div>

        {/* Email (read-only) */}
        <input
          className="auth-input"
          type="email"
          placeholder="Email *"
          value={form.email}
          aria-readonly="true"
          disabled
          style={{ backgroundColor: "#f5f5f5", color: "#666" }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
          }}
        >
          <input
            className="auth-input"
            placeholder="SSN"
            value={form.ssn}
            onChange={(e) => setField("ssn", e.target.value)}
          />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Date of Birth *</label>
            <input
              className="auth-input"
              type="date"
              value={form.dob}
              onChange={(e) => setField("dob", e.target.value)}
            />
            <div style={hintStyle}>Format: MM/DD/YYYY</div>
          </div>

          <select
            className="auth-input"
            value={form.gender}
            onChange={(e) => setField("gender", e.target.value)}
          >
            <option value="">Gender *</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
            <option>I Prefer Not to Say</option>
          </select>
        </div>

        {/* Citizenship / Work Authorization */}
        <h3 style={{ margin: "16px 0 8px" }}>
          Citizenship / Work Authorization
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
            marginTop: 8,
          }}
        >
          <select
            className="auth-input"
            value={form.citizenOrPr}
            onChange={(e) => {
              const v = e.target.value;
              setField("citizenOrPr", v);
              if (v !== "NO") {
                setField("workAuth", "");
                setField("workAuthOther", "");
                setField("workAuthStart", "");
                setField("workAuthEnd", "");
                setWorkAuthFile(null);
              }
            }}
          >
            <option value="">Are you a citizen or permanent resident?</option>
            <option value="CITIZEN">Citizen</option>
            <option value="GREENCARD">Green Card</option>
            <option value="NO">No</option>
          </select>

          {needsWorkAuth && (
            <select
              className="auth-input"
              value={form.workAuth}
              onChange={(e) => setField("workAuth", e.target.value)}
            >
              <option value="">Work authorization *</option>
              <option>H1-B</option>
              <option>L2</option>
              <option>F1(CPT/OPT)</option>
              <option>H4</option>
              <option value="OTHER">Other</option>
            </select>
          )}

          {needsWorkAuth && form.workAuth === "OTHER" && (
            <input
              className="auth-input"
              placeholder="Specify authorization *"
              value={form.workAuthOther}
              onChange={(e) => setField("workAuthOther", e.target.value)}
            />
          )}
        </div>

        {needsWorkAuth && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginTop: 8,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>
                  Work authorization start date *
                </label>
                <input
                  className="auth-input"
                  type="date"
                  value={form.workAuthStart}
                  onChange={(e) => setField("workAuthStart", e.target.value)}
                />
                <div style={hintStyle}>Start: MM/DD/YYYY</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Work authorization end date *</label>
                <input
                  className="auth-input"
                  type="date"
                  value={form.workAuthEnd}
                  onChange={(e) => setField("workAuthEnd", e.target.value)}
                />
                <div style={hintStyle}>End: MM/DD/YYYY</div>
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <label
                className="auth-button"
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                Upload Work Authorization *
                <input
                  type="file"
                  accept="image/*,.pdf"
                  style={{ display: "none" }}
                  onChange={(e) => setWorkAuthFile(e.target.files?.[0] || null)}
                />
              </label>
              {workAuthFile && (
                <span style={{ marginLeft: 8, fontSize: 12, color: "#555" }}>
                  {workAuthFile.name}
                </span>
              )}
            </div>
          </>
        )}

        {/* Driver's License */}
        <h3 style={{ margin: "16px 0 8px" }}>Driver's License</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginTop: 8,
          }}
        >
          <select
            className="auth-input d-inline"
            value={form.hasDL}
            onChange={(e) => {
              const v = e.target.value;
              setField("hasDL", v);
              if (v !== "YES") {
                setField("dlNumber", "");
                setField("dlExpire", "");
                setDlFile(null);
              }
            }}
          >
            <option value="NO">Do you have a driver's license? (Yes/No)</option>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>

          {form.hasDL === "YES" && (
            <>
              <input
                className="auth-input"
                type="date"
                // placeholder="DL Number *"
                value={form.dlNumber}
                onChange={(e) => setField("dlNumber", e.target.value)}
              />

              <div style={{ display: "flex", flexDirection: "column" }}>
                {" "}
                <input
                  className="auth-input"
                  type="date"
                  value={form.dlExpire}
                  onChange={(e) => setField("dlExpire", e.target.value)}
                />
                <label
                  className="auth-button"
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  Upload Driver's license *
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    style={{}}
                    onChange={(e) => setDlFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              {workAuthFile && (
                <span style={{ marginLeft: 8, fontSize: 12, color: "#555" }}>
                  {workAuthFile.name}
                </span>
              )}
            </>
          )}
        </div>

        {/* Reference */}
        <h3 style={{ margin: "16px 0 8px" }}>Reference</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
          }}
        >
          <input
            className="auth-input"
            placeholder="First name"
            value={form.reference.firstName}
            onChange={(e) => setNested("reference.firstName", e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Last name"
            value={form.reference.lastName}
            onChange={(e) => setNested("reference.lastName", e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Middle name"
            value={form.reference.middleName}
            onChange={(e) => setNested("reference.middleName", e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Phone"
            value={form.reference.phone}
            onChange={(e) => setNested("reference.phone", e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Address"
            value={form.reference.address}
            onChange={(e) => setNested("reference.address", e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Email"
            value={form.reference.email}
            onChange={(e) => setNested("reference.email", e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Relationship"
            value={form.reference.relationship}
            onChange={(e) =>
              setNested("reference.relationship", e.target.value)
            }
          />
        </div>

        {/* Emergency Contact */}
        <h3 style={{ margin: "16px 0 8px" }}>Emergency Contact *</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
          }}
        >
          <input
            className="auth-input"
            placeholder="First name *"
            value={form.emergency1.firstName}
            onChange={(e) => setNested("emergency1.firstName", e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Last name *"
            value={form.emergency1.lastName}
            onChange={(e) => setNested("emergency1.lastName", e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Middle name"
            value={form.emergency1.middleName}
            onChange={(e) => setNested("emergency1.middleName", e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Phone *"
            value={form.emergency1.phone}
            onChange={(e) => setNested("emergency1.phone", e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Email"
            value={form.emergency1.email}
            onChange={(e) => setNested("emergency1.email", e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Relationship"
            value={form.emergency1.relationship}
            onChange={(e) =>
              setNested("emergency1.relationship", e.target.value)
            }
          />
        </div>

        <button
          className="auth-button"
          style={{ marginTop: 12 }}
          disabled={busy}
          type="submit"
        >
          {busy ? "Saving…" : "Save draft"}
        </button>

        {err && <p style={{ color: "crimson", marginTop: 10 }}>{err}</p>}
        {ok && <p style={{ color: "#2e7d32", marginTop: 10 }}>{ok}</p>}
      </form>
    </div>
  );
}
