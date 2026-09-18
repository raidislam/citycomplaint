import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma.js";
import { generateAccessToken, generateRefreshToken } from "../../lib/jwt.js";


type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export const registerUser = async (data: RegisterData) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};


export const loginUser = async (
  email: string,
  password: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password,
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(
    user.id,
    user.role,
  );


  const refreshToken = generateRefreshToken(
    user.id,
    user.role,
  );

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ),
    },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};


export const refreshAccessToken = async (refreshToken: string) => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
  });

  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: {
        id: storedToken.id,
      },
    });

    throw new Error("Refresh token has expired");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: storedToken.userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = generateAccessToken(
    user.id,
    user.role,
  );

  return {
    accessToken,
  };
};

export const logoutUser = async (refreshToken: string) => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
  });

  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }

  await prisma.refreshToken.delete({
    where: {
      id: storedToken.id,
    },
  });
};