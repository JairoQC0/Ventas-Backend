# =========================================
# 🚀 Base de datos PostgreSQL
# =========================================
DATABASE_URL=postgresql://usuario:password@localhost:5432/ventas_db?schema=public


# =========================================
# ⚙️ Configuración del Servidor
# =========================================
PORT=4000
NODE_ENV=development


# =========================================
# 🔐 JWT (Autenticación)
# =========================================
JWT_SECRET=coloca_aqui_un_secret_seguro
JWT_EXPIRES_IN=2d


# =========================================
# 📝 Opcional: Nivel de Log
# Valores posibles: silent, error, warn, info, verbose, debug
# =========================================
LOG_LEVEL=info


# =========================================
# 🌐 URL del Frontend (CORS)
# =========================================
FRONTEND_URL=http://localhost:5173


# =========================================
# 🛡 Proxy (si estás detrás de nginx, railway, render o cloudflare)
# Para desarrollo local deja en false
# =========================================
TRUST_PROXY=false
