package com.aniketkadam.namaste_app.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${application.security.jwt.expiration}")
    private long expiration;

    @Value("${application.security.jwt.secret-key}")
    private String secreteKey;

    public String generateJwtToken(Map<String, Object> claims, UserDetails userDetails) {
        return buildJwtToken(claims, userDetails);
    }

    private String buildJwtToken(Map<String, Object> claims, UserDetails userDetails) {
        List<String> authorities = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        return Jwts.builder()
                .setSubject(claims.get("email").toString())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .claim("authorities", authorities)
                .setIssuer("NamasteApp.com")
                .signWith(getSignKey())
                .compact();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64URL.decode(secreteKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public Boolean isValidToken(String jwtToken, UserDetails userDetails) {
        final String email = extractEmail(jwtToken);
        return (email.equals(userDetails.getUsername())) && !isTokenExpired(jwtToken);
    }

    private boolean isTokenExpired(String jwtToken) {
        return extractExpired(jwtToken).before(new Date(System.currentTimeMillis()));
    }

    private Date extractExpired(String jwtToken) {
        return extractClaims(jwtToken, Claims::getExpiration);
    }

    public String extractEmail(String jwtToken) {
        return extractClaims(jwtToken, Claims::getSubject);
    }

    private <T> T extractClaims(String jwtToken, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(jwtToken);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String jwtToken) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJwt(jwtToken)
                .getBody();
    }
}
